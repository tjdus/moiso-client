"use client";
import { setCookie } from "../util/cookies";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthroizationHeader({ children }: Props) {
  const { data: session } = useSession();

  // const accessToken = session ? session.accessToken : "";
  // //const refreshToken = isLogin ? session.refreshToken : "";

  // useEffect(() => {
  //   setCookie("accessToken", accessToken);
  // }, [accessToken]);
  return <>{children}</>;
}
