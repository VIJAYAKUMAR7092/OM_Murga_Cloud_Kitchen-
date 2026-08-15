import { Metadata } from "next";
import CouponsClient from "@/components/admin/coupons/CouponsClient";

export const metadata: Metadata = {
  title: "Coupons | Admin | Om Muruga Cloud Kitchen",
  description: "Manage discount coupons and offers",
};

export default function AdminCouponsPage() {
  return <CouponsClient />;
}
