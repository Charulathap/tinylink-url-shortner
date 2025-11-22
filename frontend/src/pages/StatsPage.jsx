import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLinkStats } from "../services/linkService";

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [code]);

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getLinkStats(code);
      setData(result);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Link not found");
      } else {
        setError("Failed to load stats");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
        <Link
          to="/"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 mt-10">
      <Link
        to="/"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Analytics for <span className="text-blue-600">{code}</span>
        </h2>

        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Original URL</p>
            <a
              href={data.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {data.original_url}
            </a>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Short URL</p>
            <p className="font-medium">
              {window.location.origin.replace(':5173', ':7000')}/{code}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-3xl font-bold text-blue-600">{data.clicks}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Clicked</p>
              <p className="text-lg font-medium text-green-600">
                {data.last_clicked
                  ? new Date(data.last_clicked).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}