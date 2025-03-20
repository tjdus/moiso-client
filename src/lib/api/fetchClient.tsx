"use client";

import { signIn, useSession } from "next-auth/react";
import getSession from "../auth/auth";
import { type ApiResponseError, type ApiResponseWithData } from "./type";
import { getCookie, setCookie } from "../util/cookies";
import { revalidatePath, revalidateTag } from "next/cache";

type FetchOptions<TBody = unknown> = Omit<RequestInit, "headers" | "body"> & {
  headers?: Record<string, string>;
  body?: TBody;
  withAuth?: boolean;
  contentType?: string;
  params?: Record<string, string | number>;
  revalidatePath?: string;
  revalidateTag?: string;
};

export class FetchClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /*
  request 메소드 오버로드 정의
  TResponse를 지정하는 경우 리턴 타입은 Promise<ApiResponseWithData<TResponse>>
  TResponse를 지정하지 않는 경우 리턴 타입은 Promise<ApiResponseWithData<undefined> | null>
  */
  private async request<TResponse, TBody = unknown>(
    url: string,
    options: FetchOptions<TBody>
  ): Promise<ApiResponseWithData<TResponse>>;
  private async request<TBody = unknown>(
    url: string,
    options: FetchOptions<TBody>
  ): Promise<ApiResponseWithData<undefined> | null>;

  private async request<TResponse = undefined, TBody = unknown>(
    url: string,
    options: FetchOptions<TBody>
  ): Promise<ApiResponseWithData<TResponse> | null> {
    const {
      withAuth = false,
      contentType = "application/json",
      headers,
      body,
      params,
      revalidatePath: pathToRevalidate,
      revalidateTag: tagToRevalidate,
      ...restOptions
    } = options;

    let accessToken = await getCookie("accessToken");

    if (!accessToken && withAuth) {
      console.error("No access token available for authorization.");
      throw new Error("Unauthorized request.");
    }

    const allHeaders = new Headers(
      Object.assign(
        {
          "Content-Type": contentType,
        },
        withAuth ? { Authorization: `Bearer ${accessToken}` } : {},
        headers
      )
    );

    let queryString = "";
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      queryString = `?${searchParams.toString()}`;
    }
    let response = await fetch(`${this.baseUrl}${url}${queryString}`, {
      ...restOptions,
      headers: allHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && withAuth) {
      const newAccessToken = await this.refreshToken();
      if (newAccessToken) {
        allHeaders.set("Authorization", `Bearer ${newAccessToken}`);
        response = await fetch(`${this.baseUrl}${url}${queryString}`, {
          ...restOptions,
          headers: allHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
      } else {
        //await signIn();
      }
    }

    if (response.status === 204) {
      return null;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData as ApiResponseError;
    }

    return {
      data: responseData,
      status: response.status,
    } as ApiResponseWithData<TResponse>;
  }

  private async refreshToken() {
    try {
      const refreshToken = await getCookie("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh Token is missing");
      }
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Refresh Token expired or invalid");
        } else {
          throw new Error("Failed to refresh token");
        }
      }

      const data = await response.json();
      setCookie("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  public get<TResponse>(url: string, options?: FetchOptions) {
    return this.request<TResponse>(url, { method: "GET", ...options });
  }

  public post<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, { method: "POST", ...options });
  }

  public put<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, { method: "PUT", ...options });
  }

  public patch<TResponse, TBody>(url: string, options?: FetchOptions<TBody>) {
    return this.request<TResponse>(url, { method: "PATCH", ...options });
  }

  public delete<TResponse>(url: string, options?: FetchOptions) {
    return this.request<TResponse>(url, { method: "DELETE", ...options });
  }
}
