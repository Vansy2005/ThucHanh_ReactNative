import { PHONES } from "../data/phones";
import { Phone } from "../types";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");
export const USING_API = API_URL !== "";
console.log("API_URL =", API_URL, "| USING_API =", USING_API);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchPhone(id: string): Promise<Phone> {
  if (!USING_API) {
    await sleep(600);
    const p = PHONES.find((x) => x.id === id);
    if (!p) throw new Error("Không tìm thấy sản phẩm");
    return p;
  }
  const res = await fetch(`${API_URL}/phones/${id}`);
  if (!res.ok) throw new Error(`Máy chủ trả về lỗi ${res.status}`);
  return (await res.json()) as Phone;
}
