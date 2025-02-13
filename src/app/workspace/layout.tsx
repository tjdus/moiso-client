import MainCard from "@/components/card/MainCard";
import NavBar from "@/components/navbar/NavBar";
import SideBar from "@/components/sidebar/SideBar";
import TeamProvider from "@/lib/context/TeamContext";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex" }}>
      <TeamProvider>
        <SideBar />
        {children}
      </TeamProvider>
    </div>
  );
}
