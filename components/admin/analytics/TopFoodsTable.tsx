"use client";

import Image from "next/image";

export function TopFoodsTable({ foods }: { foods: any[] }) {
  if (!foods || foods.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        No sales data available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-[#1A1A1A]">
            <th className="p-4 text-sm font-medium text-gray-400">Food Item</th>
            <th className="p-4 text-sm font-medium text-gray-400">Category</th>
            <th className="p-4 text-sm font-medium text-gray-400 text-right">Qty Sold</th>
            <th className="p-4 text-sm font-medium text-gray-400 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {foods.map((food, idx) => (
            <tr key={food.foodId} className="hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <Image 
                      src={food.image} 
                      alt={food.name} 
                      fill 
                      className="object-cover" 
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white line-clamp-1">{food.name}</div>
                    <div className="text-xs text-gray-500">Rank #{idx + 1}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="text-xs font-medium px-2 py-1 bg-white/5 text-gray-300 rounded-lg">
                  {food.category}
                </span>
              </td>
              <td className="p-4 text-right">
                <span className="text-sm font-bold text-white">{food.quantity}</span>
              </td>
              <td className="p-4 text-right">
                <span className="text-sm font-bold text-primary">₹{food.revenue.toFixed(2)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
