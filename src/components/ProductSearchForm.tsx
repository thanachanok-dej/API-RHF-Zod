"use client";

import { useForm } from "react-hook-form";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "../lib/products";
import type { SearchQuery } from "../lib/products";
import { zodResolver } from "@hookform/resolvers/zod";


type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

// type ProductSearchFormProps ประกอบด้วย onSearch ซึ่งเป็นฟังก์ชันที่รับ SearchQuery เป็นพารามิเตอร์และคืนค่า Promise<void> โดย SearchQuery เป็นประเภทข้อมูลที่กำหนดไว้ใน lib/products.ts
export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
    // ---> v1
  //   const { register } = useForm<SearchQuery>({
  //     defaultValues: defaultQuery,
  //   });
    // ---> v2
//   const {
//     register,
//     formState: { errors },
//   } = useForm<SearchQuery>({
//     // เติม: ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
//     resolver: zodResolver(SearchQuerySchema),
//     mode: "onTouched",
//     defaultValues: defaultQuery,
//   });
  // ---> v3
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
    /* ตัวเลือกเดิม */
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate>
      {/* q มีหน้าที่เป็นคำค้นหา, limit เป็นจำนวนรายการที่ต้องการแสดงผล, sortBy เป็นฟิลด์ที่ใช้ในการเรียงลำดับ */}
      <label htmlFor="q">คำค้น</label>
      <input id="q" {...register("q")} placeholder="phone" />
      {/*       
      <label htmlFor="limit">จำนวนรายการ</label>
      <input id="limit" type="number" required
             // เติม: ชื่อฟิลด์ที่ต้องการผูกเข้ากับฟอร์ม ตั้งชื่อฟิลด์เป็น "limit" และกำหนดให้ค่าที่ป้อนเข้ามาเป็นตัวเลขด้วย valueAsNumber: true
             {...register("limit", { valueAsNumber: true })} /> */}

      <label htmlFor="limit">จำนวนรายการ</label>
      <input
        id="limit"
        type="number"
        required
        {...register("limit", { valueAsNumber: true })}
        aria-invalid={!!errors.limit}
        aria-describedby="limit-error"
      />
      <span id="limit-error" role="alert">
        {errors.limit?.message}
      </span>

      <label htmlFor="sortBy">เรียงตาม</label>
      <select id="sortBy" {...register("sortBy")}>
        {SORT_FIELDS.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>

      <button type="submit">ค้นหา</button>
    </form>
  );
}
