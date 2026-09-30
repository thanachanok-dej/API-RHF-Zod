"use client";

import { useForm } from "react-hook-form";
import {
  Product,
  ProductDraft,
  CATEGORIES,
} from "../lib/products";

interface ProductFormProps {
  editing?: Product | null;
  onSave: (data: ProductDraft) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductDraft>({
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          thumbnail: editing.thumbnail || "",
        }
      : {
          title: "",
          price: undefined, // ปล่อยว่างไว้ ไม่เซตเป็น 0
          stock: undefined, // ปล่อยว่างไว้ ไม่เซตเป็น 0
          category: CATEGORIES[0],
          thumbnail: "",
        },
  });

  const onSubmit = (data: ProductDraft) => {
    // แปลงค่าราคาและจำนวนสต็อกเป็น Number ก่อนส่งบันทึก
    onSave({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    });
  };

  // Class สำหรับตกแต่งช่อง Input และกรอบสีแดงเมื่อมี Error
  const getInputClass = (hasError?: boolean) =>
    `w-full px-3.5 py-2 border-2 ${
      hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
    } rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-sm shadow-sm transition-all`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. ชื่อสินค้า */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            ชื่อสินค้า <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="กรอกชื่อสินค้า"
            {...register("title", {
              required: "กรุณากรอกชื่อสินค้า",
            })}
            className={getInputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              ⚠️ {errors.title.message}
            </p>
          )}
        </div>

        {/* 2. ราคา */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            ราคา ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="กรอกราคา"
            {...register("price", {
              required: "กรุณากรอกราคา",
              min: { value: 0.01, message: "ราคาต้องมากกว่า 0" },
            })}
            className={getInputClass(!!errors.price)}
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              ⚠️ {errors.price.message}
            </p>
          )}
        </div>

        {/* 3. จำนวนคงเหลือ */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            จำนวนคงเหลือ <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="กรอกจำนวนคงเหลือ"
            {...register("stock", {
              required: "กรุณากรอกจำนวนคงเหลือ",
              min: { value: 0, message: "จำนวนคงเหลือต้องไม่ติดลบ" },
            })}
            className={getInputClass(!!errors.stock)}
          />
          {errors.stock && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              ⚠️ {errors.stock.message}
            </p>
          )}
        </div>

        {/* 4. หมวดหมู่ */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            หมวดหมู่ <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category", {
              required: "กรุณาเลือกหมวดหมู่",
            })}
            className={getInputClass(!!errors.category)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              ⚠️ {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* ปุ่มกด บันทึก / ยกเลิก */}
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-all"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
        >
          {editing ? "💾 บันทึกการแก้ไข" : "➕ เพิ่มสินค้า"}
        </button>
      </div>
    </form>
  );
}