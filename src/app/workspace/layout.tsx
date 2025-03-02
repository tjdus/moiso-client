import MainCard from "@/components/card/MainCard";
import NavBar from "@/components/navbar/NavBar";
import SideBar from "@/components/sidebar/SideBar";
import TeamProvider from "@/lib/context/TeamContext";
import { Toaster } from "@/components/ui/toaster";
import { Card, Container } from "@chakra-ui/react";
import ProfileBar from "@/components/navbar/ProfileBar";
import RoleProvider from "@/lib/context/RoleContext";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex" }}>
      <TeamProvider>
        <RoleProvider>
          <SideBar />
          <Card.Root variant={"elevated"} width={"100%"}>
            <ProfileBar />
            <Card.Body>{children}</Card.Body>
          </Card.Root>
          <Toaster />
        </RoleProvider>
      </TeamProvider>
    </div>
  );
}
