import Link from "next/link";
import { getIncidents } from "@/lib/incidents";

const SEVERITY_COLOR: Record<string, string> = {
  low: "text-neutral-400",
  medium: "text-amber-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-500">
            <th className="px-4 py-3 font-mono text-xs uppercase">Title</th>
            <th className="px-4 py-3 font-mono text-xs uppercase">Status</th>
            <th className="px-4 py-3 font-mono text-xs uppercase">Severity</th>
            <th className="px-4 py-3 font-mono text-xs uppercase">Created</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              className="border-b border-neutral-900 last:border-0 hover:bg-neutral-900"
            >
              <td className="px-4 py-3">
                <Link href={`/incidents/${incident.id}`} className="hover:underline">
                  {incident.title}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-neutral-300">{incident.status}</td>
              <td className={"px-4 py-3 capitalize " + SEVERITY_COLOR[incident.severity]}>
                {incident.severity}
              </td>
              <td className="px-4 py-3 text-neutral-500">
                {new Date(incident.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}