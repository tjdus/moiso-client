"use server";
import { LoginDTO, SignupDTO } from "./interface/login";
import { setCookie } from "../util/cookies";
import { ErrorResponse } from "./interface/errors";
import { error } from "console";

const baseUrl = "http://localhost:8000";

export async function login({ username, password }: LoginDTO) {
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
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

export async function signup({ email, name, password, username }: SignupDTO) {
  const response = await fetch(`${baseUrl}/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    return {
      error: errorData,
      status: response.status,
    };
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

export async function logout() {
  try {
    return { success: true };
  } catch (error) {
    console.error("로그아웃 실패:", error);
    return { success: false, messgage: "로그아웃 실패" };
  }
}

export async function getInvitation(token: string) {
  const response = await fetch(`${baseUrl}/api/invitations/${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return {
    data: await response.json(),
    status: response.status,
  };
}

export async function signupWithInvitation({
  email,
  name,
  password,
  username,
  id,
}: SignupDTO & { id: string }) {
  const response = await fetch(`${baseUrl}/api/signup/invitations/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      username,
      password,
    }),
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    return {
      error: errorData,
      status: response.status,
    };
  }
  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}
