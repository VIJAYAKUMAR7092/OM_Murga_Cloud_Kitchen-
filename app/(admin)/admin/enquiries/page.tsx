import { getEnquiries, getEnquiryMetrics } from "@/server/queries/enquiries";
import { EnquiriesTable } from "@/components/admin/enquiries/EnquiriesTable";
import { Mail, MailOpen, Reply, Inbox } from "lucide-react";
import { EnquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? (params.status as EnquiryStatus) : undefined;

  const [enquiriesData, metrics] = await Promise.all([
    getEnquiries({ page, limit: 10, search, status }),
    getEnquiryMetrics(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Enquiries</h1>
          <p className="text-gray-400 text-sm mt-1">Manage contact form messages and inquiries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <h3 className="text-2xl font-bold text-white">{metrics.total}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">New</p>
              <h3 className="text-2xl font-bold text-white">{metrics.newCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-400">
              <MailOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Read</p>
              <h3 className="text-2xl font-bold text-white">{metrics.readCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Reply className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Replied</p>
              <h3 className="text-2xl font-bold text-white">{metrics.repliedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl shadow-sm overflow-hidden">
        <EnquiriesTable
          initialEnquiries={enquiriesData.enquiries}
          totalPages={enquiriesData.totalPages}
          currentPage={page}
          searchQuery={search}
          currentStatus={status}
        />
      </div>
    </div>
  );
}
