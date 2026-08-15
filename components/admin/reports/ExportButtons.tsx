"use client";

import { Download, ChevronDown, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ExportButtons({
  data,
  filenamePrefix,
}: {
  data: any[];
  filenamePrefix: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filename = `${filenamePrefix}_${new Date().toISOString().split('T')[0]}`;

  const handleExportCSV = () => {
    try {
      if (!data || data.length === 0) return toast.error("No data available");
      const headers = Object.keys(data[0]);
      const csvRows = [];
      csvRows.push(headers.join(","));
      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header] !== null && row[header] !== undefined ? row[header] : "";
          const stringVal = String(val).replace(/"/g, '""');
          return `"${stringVal}"`;
        });
        csvRows.push(values.join(","));
      }
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Exported successfully");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsOpen(false);
    }
  };

  const handleExportExcel = () => {
    try {
      if (!data || data.length === 0) return toast.error("No data available");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${filename}.xlsx`);
      toast.success("Excel Exported successfully");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsOpen(false);
    }
  };

  const handleExportPDF = () => {
    try {
      if (!data || data.length === 0) return toast.error("No data available");
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Om Muruga Cloud Kitchen - Report", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Report Type: ${filenamePrefix.split('_')[0]}`, 14, 36);

      const headers = Object.keys(data[0]);
      const rows = data.map(obj => headers.map(key => obj[key]));

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [212, 175, 55], textColor: 0 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      doc.save(`${filename}.pdf`);
      toast.success("PDF Exported successfully");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors text-sm font-bold"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 text-sm text-gray-200 transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-green-500" /> Excel (.xlsx)
          </button>
          <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 text-sm text-gray-200 transition-colors border-t border-white/5">
            <FileJson className="w-4 h-4 text-blue-500" /> CSV (.csv)
          </button>
          <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 text-sm text-gray-200 transition-colors border-t border-white/5">
            <FileText className="w-4 h-4 text-red-500" /> PDF (.pdf)
          </button>
        </div>
      )}
    </div>
  );
}
