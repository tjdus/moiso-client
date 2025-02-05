"use server";

import { cookies } from "next/headers";

export async function setCookie(key: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(key, value);
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? "";
};

export const deleteCookie = async (name: string) => {
  (await cookies()).delete(name);
};
