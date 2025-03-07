import TeamProvider from "@/lib/context/TeamProvider";

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TeamProvider>{children}</TeamProvider>;
}
