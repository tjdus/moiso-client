"use client";

import { useState } from "react";
import { HStack, Input, IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

const SearchBox = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <HStack width="40%">
      <Input
        padding={2}
        colorPalette="gray"
        variant="outline"
        placeholder="검색하기"
        size="sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <IconButton
        variant="ghost"
        aria-label="Search"
        size="sm"
        boxSizing="border-box"
        colorPalette="gray"
        onClick={handleSearch}
      >
        <LuSearch size="sm" />{" "}
      </IconButton>
    </HStack>
  );
};

export default SearchBox;