import ProjectProvider from "@/lib/context/ProjectContext";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
