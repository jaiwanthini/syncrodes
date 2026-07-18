create or replace function match_ai_memory(query_embedding vector(1536), match_count int)
returns table (id uuid, incident_id uuid, summary text, resolution text, similarity float)
language sql stable
as $$
  select id, incident_id, summary, resolution,
         1 - (embedding <=> query_embedding) as similarity
  from ai_memory
  order by embedding <=> query_embedding
  limit match_count;
$$;