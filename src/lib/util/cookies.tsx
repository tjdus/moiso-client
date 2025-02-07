"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie ? cookie.value : "";
}

export async function setCookie(name: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
