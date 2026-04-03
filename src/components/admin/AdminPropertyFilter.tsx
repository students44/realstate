"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";

export default function AdminPropertyFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/admin/properties?${params.toString()}`);
  };

  return (
    <div className="relative flex-1 sm:flex-none">
      <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        className="pl-10 pr-10 py-2 bg-foreground/5 border border-foreground/10 rounded-xl outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold text-sm"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}
