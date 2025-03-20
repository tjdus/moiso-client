"use client";
import { getCategoryDetail } from "@/lib/api/getApi";
import { CategoryNameDTO } from "@/lib/api/interface/fetchDTOs";
import { Tag } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const CategoryItem = ({ id }: { id: string }) => {
  const [category, setCategory] = useState<CategoryNameDTO>();
  const fetchCategoryDetail = useCallback(async () => {
    const response = await getCategoryDetail(id);
    if (response) {
      setCategory(response.data);
    }
  }, [id]);

  useEffect(() => {
    fetchCategoryDetail();
  }, [fetchCategoryDetail]);

  return category ? (
    <Tag.Root
      gap={2}
      size="md"
      colorPalette={getCategoryColor(id)}
      variant="solid"
    >
      <Tag.Label px={2}>{category.name}</Tag.Label>
    </Tag.Root>
  ) : null;
};

const CATEGORY_COLORS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
] as const;

type CategoryColor = (typeof CATEGORY_COLORS)[number];

export function getCategoryColor(id: string | null | undefined): CategoryColor {
  if (!id) {
    return CATEGORY_COLORS[0];
  }
  const colorIndex = parseInt(id) % CATEGORY_COLORS.length;

  return CATEGORY_COLORS[colorIndex];
}

export { CategoryItem };
