import { z } from "zod";

// รายชื่อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
export const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries",
  "home-decoration", "kitchen-accessories", "laptops",
  "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "motorcycle", "skin-care",
  "smartphones", "sports-accessories", "sunglasses",
  "tablets", "tops", "vehicle", "womens-bags",
  "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  // เติม: เงื่อนไขที่บังคับว่าข้อความต้องยาวอย่างน้อยเท่าใด
  title: z.string().trim().min(0, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  thumbnail: z.string().optional().default(""),
});


export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// เติม: ตัวช่วยของ Zod ที่อ่าน Type ออกมาจาก Schema
export type Product     = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
//เอามาจากเว็บไหน
const API_BASE = "https://dummyjson.com";

export const SORT_FIELDS = ["title", "price", "stock"] as const;

export type SearchQuery = {
  q: string;
  limit: number;
  sortBy: (typeof SORT_FIELDS)[number];
};

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();
  params.set("q", query.q);
  // เติม: เมธอดที่กำหนดค่าให้พารามิเตอร์หนึ่งตัว
  //.set เอาไว้ตัดต่อ string ของ URLSearchParams โดยกำหนดชื่อพารามิเตอร์และค่าของมัน
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");
  params.set("select", "title,price,stock,category,thumbnail");

  const url = `${API_BASE}/products/search?${params.toString()}`;
  console.log("เรียก URL :", url);
  return url;
}



// ถ้ามี await ต้องใส่ async ด้วย ซึ่ง async ทำงานแบบอะซิงโครนัส คือ ทำงานแบบไม่ต้องรอให้เสร็จสิ้นก่อนที่จะทำงานต่อไป
export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query));
  console.log("สถานะการตอบกลับ :", response);
// await fetch() เป็นการเรียก API แบบอะซิงโครนัส โดยจะรอให้ fetch() ทำงานเสร็จสิ้นก่อนที่จะทำงานต่อไป
  // เติม: ค่าที่บอกว่าสถานะการตอบกลับอยู่ในช่วง 200 ถึง 299 หรือไม่
  // response.ok เป็น property ของ Response object ที่บอกว่าสถานะการตอบกลับอยู่ในช่วง 200 ถึง 299 หรือไม่
  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }

  // เติม: เมธอดที่อ่านเนื้อหาการตอบกลับเป็น JSON
  const data = await response.json();
  console.log("ข้อมูลที่ได้รับ :", data);

  // เติม: เมธอดที่ตรวจข้อมูลแล้วคืนผลลัพธ์แทนการโยน Error
  const result = ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  return result.data;
}
