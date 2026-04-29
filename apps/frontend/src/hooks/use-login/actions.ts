"use server";

import { cookies } from "next/headers";
import type { LoginRequest, AuthResponse } from "shared-types";

export async function loginAction(credentials: LoginRequest) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Login failed",
      };
    }

    const data = (await response.json()) as AuthResponse;

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookieStore.set("role", data.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "Connection error occurred" };
  }
}
