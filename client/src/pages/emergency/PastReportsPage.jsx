import { Button } from "@/components/ui/button"; // Importing Button
import { Badge } from "@/components/ui/badge";

const reports = [
  { id: 1, location: "Colombo - Galle Road", type: "Breakdown", status: "Pending", date: "2025-04-28" },
  { id: 2, location: "Kandy - Peradeniya Road", type: "Accident", status: "Resolved", date: "2025-04-25" },
];

export default function PastReports() {
  return (
    <div className="max-w-4xl mx-auto p-6 rounded-2xl shadow-lg bg-white mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📄 My Past Reports</h2>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="border p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{report.type}</h3>
              <p className="text-gray-500 text-sm">{report.location}</p>
              <p className="text-gray-400 text-xs">{report.date}</p>
            </div>
            <Button variant="outline" size="sm">
              See More
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
