import NavBar from "@/components/navbar/nav-bar";
import SideBar from "@/components/sidebar/side-bar";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <NavBar />
      <main style={{ flex: 1, padding: "16px" }}>{children}</main>
    </div>
  );
}
