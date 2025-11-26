// src/components/LinkTable.jsx
import { useState } from "react";

export default function LinkTable({ links, onDelete, loading }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000";

  const handleCopy = async (code) => {
    const shortUrl = `${API_URL}/${code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Short Code</th>
            <th className="p-3 text-left">Original URL</th>
            <th className="p-3 text-center">Clicks</th>
            <th className="p-3 text-center">Last Clicked</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                <div className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : links.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                No links found
              </td>
            </tr>
          ) : (
            links.map((item) => (
              <tr key={item.short_code} className="border-b hover:bg-gray-50">
                {/* Short code with copy button */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`${API_URL}/${item.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {item.short_code}
                    </a>
                    <button
                      onClick={() => handleCopy(item.short_code)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy short URL"
                    >
                      {copiedCode === item.short_code ? (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>

                {/* Original URL with ellipsis */}
                <td className="p-3">
                  <div className="truncate max-w-[300px]" title={item.original_url}>
                    {item.original_url}
                  </div>
                </td>

                {/* Clicks */}
                <td className="p-3 text-center">{item.clicks}</td>

                {/* Last clicked */}
                <td className="p-3 text-center">
                  {item.last_clicked
                    ? new Date(item.last_clicked).toLocaleString()
                    : "—"}
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <a
                      href={`/code/${item.short_code}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Stats
                    </a>
                    <button
                      onClick={() => onDelete(item.short_code)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
