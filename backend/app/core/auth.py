from functools import lru_cache
from types import SimpleNamespace

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

_bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _jwks_client() -> "jwt.PyJWKClient | None":
    if not settings.SUPABASE_URL:
        return None
    return jwt.PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> SimpleNamespace:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = credentials.credentials

    try:
        algorithm = jwt.get_unverified_header(token).get("alg", "HS256")

        if algorithm == "HS256":
            # Legacy Supabase projects sign access tokens with the shared JWT secret.
            if not settings.SUPABASE_JWT_SECRET:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Server auth is not configured (SUPABASE_JWT_SECRET missing)",
                )
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        else:
            # Newer Supabase projects sign access tokens asymmetrically (ES256/RS256)
            # and publish the verification key via a JWKS endpoint.
            jwks_client = _jwks_client()
            if jwks_client is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Server auth is not configured (SUPABASE_URL missing)",
                )
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=[algorithm],
                audience="authenticated",
            )
    except (jwt.PyJWTError, jwt.PyJWKClientError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
        )

    return SimpleNamespace(id=user_id, email=payload.get("email"))
