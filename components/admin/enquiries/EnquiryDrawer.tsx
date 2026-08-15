"use client";

import { CustomerEnquiry, EnquiryStatus } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Mail, Globe, MapPin, Tag } from "lucide-react";
import { useState } from "react";

export function EnquiryDrawer({
  isOpen,
  onClose,
  enquiry,
  onStatusChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  enquiry: CustomerEnquiry | null;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!enquiry) return null;

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    setIsUpdating(true);
    await onStatusChange(enquiry.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1A1A1A]">
              <div>
                <h2 className="text-xl font-bold text-white">Enquiry Details</h2>
                <p className="text-sm text-gray-400 mt-1">ID: {enquiry.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Current Status
                </label>
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  disabled={isUpdating}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none disabled:opacity-50"
                >
                  <option value="NEW">New</option>
                  <option value="READ">Read</option>
                  <option value="REPLIED">Replied</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                  Customer Information
                </h3>
                <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-white font-medium">{enquiry.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${enquiry.phone}`} className="text-white hover:text-primary transition-colors font-medium">
                        {enquiry.phone}
                      </a>
                    </div>
                  </div>
                  {enquiry.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${enquiry.email}`} className="text-white hover:text-primary transition-colors font-medium">
                          {enquiry.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                  Message Details
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <p className="text-sm text-gray-500">Subject</p>
                    </div>
                    <p className="text-white font-medium text-lg leading-snug">
                      {enquiry.subject}
                    </p>
                  </div>
                  <div className="p-5 bg-black/20">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {enquiry.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                  System Metadata
                </h3>
                <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="text-white text-sm">
                        {new Date(enquiry.createdAt).toLocaleString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  {enquiry.ipAddress && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">IP Address</p>
                        <p className="text-white text-sm">{enquiry.ipAddress}</p>
                      </div>
                    </div>
                  )}
                  {enquiry.userAgent && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">User Agent</p>
                        <p className="text-white text-xs break-all leading-relaxed opacity-80">
                          {enquiry.userAgent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#1A1A1A]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
