import { prisma } from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";

export async function getEnquiries({
  page = 1,
  limit = 10,
  search = "",
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: EnquiryStatus;
}) {
  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { subject: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [enquiries, total] = await Promise.all([
    prisma.customerEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customerEnquiry.count({ where }),
  ]);

  return {
    enquiries,
    totalPages: Math.ceil(total / limit),
    total,
  };
}

export async function getEnquiryMetrics() {
  const [total, newCount, readCount, repliedCount] = await Promise.all([
    prisma.customerEnquiry.count(),
    prisma.customerEnquiry.count({ where: { status: "NEW" } }),
    prisma.customerEnquiry.count({ where: { status: "READ" } }),
    prisma.customerEnquiry.count({ where: { status: "REPLIED" } }),
  ]);

  return {
    total,
    newCount,
    readCount,
    repliedCount,
  };
}
