"use client";

import { useForm } from "react-hook-form";
import { SearchQuery } from "../lib/products";

interface ProductSearchFormProps {
  onSearch: (data: SearchQuery) => void;
}

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const { register, handleSubmit } = useForm<SearchQuery>({
    defaultValues: {
      q: "",
      limit: 10,
      sortBy: "title",
    },
  });

  const onSubmit = (data: SearchQuery) => {
    onSearch(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
      {/* 1. ช่องค้นหาชื่อสินค้า */}
      <div className="flex-1">
        <input
          type="text"
          placeholder=" พิมพ์ชื่อสินค้าที่ต้องการค้นหา..."
          {...register("q")}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
        />
      </div>

      {/* 2. เลือกการเรียงลำดับ (Sort By) - เพิ่มกลับเข้ามา */}
      <div className="w-full sm:w-40">
        <select
          {...register("sortBy")}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="title">เรียงตามชื่อ</option>
          <option value="price">เรียงตามราคา</option>
          <option value="stock">เรียงตามคงเหลือ</option>
        </select>
      </div>

      {/* 3. เลือกจำนวนรายการ (Limit) - เพิ่มกลับเข้ามา */}
      <div className="w-full sm:w-28">
        <select
          {...register("limit")}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={5}>5 รายการ</option>
          <option value={10}>10 รายการ</option>
          <option value={20}>20 รายการ</option>
          <option value={30}>30 รายการ</option>
        </select>
      </div>

      {/* ปุ่มกดค้นหา */}
      <button
        type="submit"
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all whitespace-nowrap"
      >
        ค้นหา
      </button>
    </form>
  );
}