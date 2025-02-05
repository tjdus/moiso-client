"use server";
import { LoginDTO, SignupDTO } from "../interface/login";
import axiosInstance from "../axiosInstance";
import { setCookie, deleteCookie } from "../cookies";

export async function login({ username, password }: LoginDTO) {
  try {
    const response = await axiosInstance.post("/login", {
      username,
      password,
    });

    const token = response.data.accessToken;
    setCookie("accessToken", token);

    return { success: true };
  } catch (error) {
    console.error("로그인 실패:", error);
    return { success: false, message: "로그인 실패" };
  }
}

export async function signup({ email, password, username }: SignupDTO) {
  try {
    const response = await axiosInstance.post("/signup", {
      email,
      password,
      username,
      name,
    });
    return { success: true };
  } catch (error) {
    console.error("회원가입 실패:", error);
    return { success: false, message: "회원가입 실패" };
  }
}

export async function logout() {
  try {
    deleteCookie("accessToken");
    return { success: true };
  } catch (error) {
    console.error("로그아웃 실패:", error);
    return { success: false, messgage: "로그아웃 실패" };
  }
}
