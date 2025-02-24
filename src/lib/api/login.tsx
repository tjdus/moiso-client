"use server";
import { LoginDTO, SignupDTO } from "../interface/login";
import { setCookie } from "../util/cookies";

const baseUrl = "http://localhost:8000";

export async function login({ username, password }: LoginDTO) {
  try {
    const response = await fetch(`${baseUrl}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    setCookie("accessToken", accessToken);
    setCookie("refreshToken", refreshToken);

    return { success: true, accessToken, refreshToken };
  } catch (error) {
    console.error("로그인 실패:", error);
    return { success: false, message: "로그인 실패" };
  }
}

// export async function signup({ email, password, username }: SignupDTO) {
//   try {
//     const response = await axiosInstance.post("/signup", {
//       email,
//       password,
//       username,
//       name,
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("회원가입 실패:", error);
//     return { success: false, message: "회원가입 실패" };
//   }
// }

// export async function logout() {
//   try {
//     return { success: true };
//   } catch (error) {
//     console.error("로그아웃 실패:", error);
//     return { success: false, messgage: "로그아웃 실패" };
//   }
// }
