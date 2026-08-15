"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CustomerEnquiry, EnquiryStatus } from "@prisma/client";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Trash2,
  Mail,
  MailOpen,
  Reply,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { EnquiryDrawer } from "./EnquiryDrawer";

export function EnquiriesTable({
  initialEnquiries,
  totalPages,
  currentPage,
  searchQuery,
  currentStatus,
}: {
  initialEnquiries: CustomerEnquiry[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  currentStatus?: EnquiryStatus;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "ALL">(currentStatus || "ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<CustomerEnquiry | null>(null);

  const updateUrl = (newSearch: string, newPage: number, newStatus: string) => {
    const params = new URLSearchParams(searchParams);
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");
    
    if (newPage > 1) params.set("page", newPage.toString());
    else params.delete("page");

    if (newStatus !== "ALL") params.set("status", newStatus);
    else params.delete("status");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(search, 1, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus as EnquiryStatus | "ALL");
    updateUrl(search, 1, newStatus);
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setEnquiries((prev) =>
        prev.map((eq) => (eq.id === id ? { ...eq, status: newStatus } : eq))
      );
      
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }

      toast.success("Status updated", {
        style: { background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
      });
      router.refresh();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setEnquiries((prev) => prev.filter((eq) => eq.id !== enquiryToDelete.id));
      setEnquiryToDelete(null);
      toast.success("Enquiry deleted", {
        style: { background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete enquiry");
    }
  };

  const getStatusIcon = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW": return <Mail className="w-4 h-4 text-primary" />;
      case "READ": return <MailOpen className="w-4 h-4 text-gray-400" />;
      case "REPLIED": return <Reply className="w-4 h-4 text-green-500" />;
      case "CLOSED": return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#1A1A1A]">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Status</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#1A1A1A]">
              <th className="p-4 text-sm font-medium text-gray-400">Date</th>
              <th className="p-4 text-sm font-medium text-gray-400">Customer</th>
              <th className="p-4 text-sm font-medium text-gray-400">Subject</th>
              <th className="p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No enquiries found
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-white">{enquiry.name}</div>
                    <div className="text-xs text-gray-500">{enquiry.email || enquiry.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300 truncate max-w-[200px]">{enquiry.subject}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enquiry.status)}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        enquiry.status === "NEW" ? "bg-primary/10 text-primary" :
                        enquiry.status === "REPLIED" ? "bg-green-500/10 text-green-500" :
                        enquiry.status === "CLOSED" ? "bg-blue-500/10 text-blue-500" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enquiry);
                          setIsDrawerOpen(true);
                          if (enquiry.status === "NEW") {
                            handleStatusChange(enquiry.id, "READ");
                          }
                        }}
                        className="p-2 bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEnquiryToDelete(enquiry)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-white/5">
        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No enquiries found</div>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-white">{enquiry.name}</div>
                  <div className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleString("en-IN")}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                  enquiry.status === "NEW" ? "bg-primary/10 text-primary" :
                  enquiry.status === "REPLIED" ? "bg-green-500/10 text-green-500" :
                  enquiry.status === "CLOSED" ? "bg-blue-500/10 text-blue-500" :
                  "bg-gray-500/10 text-gray-400"
                }`}>
                  {getStatusIcon(enquiry.status)}
                  {enquiry.status}
                </div>
              </div>
              <div className="text-sm text-gray-300 font-medium">{enquiry.subject}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedEnquiry(enquiry);
                    setIsDrawerOpen(true);
                    if (enquiry.status === "NEW") handleStatusChange(enquiry.id, "READ");
                  }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors flex justify-center items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => setEnquiryToDelete(enquiry)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center bg-[#1A1A1A]">
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updateUrl(search, currentPage - 1, statusFilter)}
              disabled={currentPage === 1}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => updateUrl(search, currentPage + 1, statusFilter)}
              disabled={currentPage === totalPages}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <EnquiryDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEnquiry(null);
        }}
        enquiry={selectedEnquiry}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Delete Enquiry?</h3>
              <p className="text-gray-400">
                Are you sure you want to delete the enquiry from <span className="text-white font-medium">{enquiryToDelete.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-black/20 flex justify-end gap-3 border-t border-white/5">
              <button
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
