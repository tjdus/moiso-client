"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MyTabBar from "@/components/my/MyTab";
import TodoList from "@/components/my/TodoList";

export default function MyPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div>
      {tab === "profile" && <div>Profile Content</div>}
      {tab === "list" && <MyTabBar />}
      {tab === "todo" && <TodoList />}
    </div>
  );
}
