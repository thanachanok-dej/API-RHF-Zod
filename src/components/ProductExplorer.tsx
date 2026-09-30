"use client";

import { useState, useEffect } from "react";
import { Product, ProductDraft, SearchQuery } from "../lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // State สำหรับการค้นหาและเรียงลำดับ
  const [searchParams, setSearchParams] = useState<SearchQuery>({
    q: "",
    limit: 10,
    sortBy: "title",
  });

  // โหลดข้อมูลสินค้าเริ่มต้นจาก API
  useEffect(() => {
    async function loadInitialProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://dummyjson.com/products?limit=30");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialProducts();
  }, []);

  // ฟังก์ชันรับค่าการค้นหา
  const handleSearch = (query: SearchQuery) => {
    setSearchParams(query);
  };

  // 1. กรองสินค้า (ทั้งจาก API และสินค้าใหม่)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes((searchParams.q || "").toLowerCase())
  );

  // 2. เรียงลำดับสินค้าตาม sortBy (title, price, stock)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const sortBy = searchParams.sortBy || "title";

    let valA = a[sortBy as keyof Product];
    let valB = b[sortBy as keyof Product];

    if (typeof valA === "string") {
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
    }

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  // 3. ตัดจำนวนรายการตาม limit
  const displayProducts = sortedProducts.slice(
    0,
    searchParams.limit ? Number(searchParams.limit) : 10
  );

  const editingProduct = products.find((p) => p.id === editingId) ?? null;

  const saveProduct = (data: ProductDraft) => {
    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...data } : item
        )
      );
      setEditingId(null);
    } else {
      const newProduct: Product = {
        ...data,
        id: Date.now(),
        thumbnail: "https://via.placeholder.com/150",
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 p-4 sm:p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            📦 ระบบจัดการสินค้า
          </h1>
        </div>

        {/* Section 1: ค้นหาและฟอร์มจัดการสินค้า */}
        <div className="grid grid-cols-1 gap-6">
          {/* การ์ดค้นหา */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-900">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              🔍 ค้นหาสินค้า
            </h2>
            {/* @ts-ignore */}
            <ProductSearchForm onSearch={(q) => handleSearch(q as any)} />
          </div>

          {/* การ์ดฟอร์มเพิ่ม/แก้ไข */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                {editingId !== null ? "✏ แก้ไขข้อมูลสินค้า" : "➕ เพิ่มสินค้าใหม่"}
              </h2>
              {editingId !== null && (
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-semibold">
                  กำลังแก้ไข ID: {editingId}
                </span>
              )}
            </div>
            <ProductForm
              key={editingId ?? "new"}
              editing={editingProduct}
              onSave={saveProduct}
              onCancel={handleCancel}
            />
          </div>
        </div>

        {/* Section 2: ตารางแสดงรายการสินค้า */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              📋 รายการสินค้าทั้งหมด
            </h2>
            <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-3 py-1 rounded-full">
              แสดง {displayProducts.length} จาก {filteredProducts.length} รายการ
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <th className="px-6 py-3.5 text-center">รูปภาพ</th>
                    <th className="px-6 py-3.5">ชื่อสินค้า</th>
                    <th className="px-6 py-3.5">หมวดหมู่</th>
                    <th className="px-6 py-3.5">ราคา</th>
                    <th className="px-6 py-3.5">คงเหลือ</th>
                    <th className="px-6 py-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                  {displayProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">
                        ไม่พบข้อมูลสินค้าที่ค้นหา
                      </td>
                    </tr>
                  ) : (
                    displayProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3 text-center">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200 mx-auto bg-gray-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg border border-gray-200 mx-auto bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {product.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              product.stock < 10
                                ? "bg-red-100 text-red-800 font-bold"
                                : "text-gray-700"
                            }`}
                          >
                            {product.stock} ชิ้น
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => setEditingId(product.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg transition-all"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}