import { useState, useEffect } from "react";
import AddLinkModal from "../components/AddLinkModal";
import LinkTable from "../components/LinkTable";
import { getAllLinks, createShortLink, deleteLink } from "../services/linkService";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadLinks();
  }, []);

  // Filter links when search query or links change
  useEffect(() => {
    if (!loading) {
      if (!searchQuery.trim()) {
        setFilteredLinks(links);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = links.filter(
          (link) =>
            link.short_code.toLowerCase().includes(query) ||
            link.original_url.toLowerCase().includes(query)
        );
        setFilteredLinks(filtered);
      }
    }
  }, [searchQuery, links, loading]);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      setError("Failed to load links. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (url, customCode) => {
    await createShortLink(url, customCode);
    setOpen(false);
    setSuccess("Link created successfully!");
    loadLinks();
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await deleteLink(code);
      setSuccess("Link deleted successfully!");
      loadLinks();
    } catch (err) {
      setError("Failed to delete link.");
    }
  };

  return (
    <div className="px-6 py-4">
      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header row: Search on left, Add button on right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Add New Link Button */}
        <button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>➕</span> Add New Link
        </button>
      </div>

      {/* Link Table */}
      <LinkTable 
        links={filteredLinks} 
        onDelete={handleDelete} 
        loading={loading} 
      />

      {/* Add Link Modal */}
      {open && (
        <AddLinkModal
          onClose={() => setOpen(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
}