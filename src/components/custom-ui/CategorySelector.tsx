"use client";

import {
  createListCollection,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { LuPlus } from "react-icons/lu";
import { TagItem } from "./Tag";
import { useEffect, useMemo, useState } from "react";
import { CategoryNameDTO } from "@/lib/api/interface/fetchDTOs";
import { getCategoryList } from "@/lib/api/getApi";
import { toaster } from "../ui/toaster";
import { createCategory } from "@/lib/api/postApi";
import { CategoryInput } from "@/lib/api/interface/requestDTO";

interface CategorySelectorProps {
  teamId: string;
  value: string;
  onValueChange: (items: string) => void;
}

const SelectTagItem = () => (
  <SelectValueText width="3xs">
    {(items: Array<{ id: string; name: string }>) => (
      <HStack>
        {items.map(({ id, name }) => (
          <HStack key={id}>
            <TagItem id={id} name={name} size="md" />
          </HStack>
        ))}
      </HStack>
    )}
  </SelectValueText>
);

const CategorySelector = ({
  teamId,
  value,
  onValueChange,
}: CategorySelectorProps) => {
  const [categories, setCategories] = useState<CategoryNameDTO[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const getCategories = async ({ teamId }: { teamId: string }) => {
    try {
      const response = await getCategoryList({ teamId });
      setCategories(response.data.results);
    } catch (error) {
      toaster.error({
        title: "카테고리 불러오기 실패",
      });
    }
  };

  const createNewCategory = async ({ name }: { name: string }) => {
    try {
      const requestData: CategoryInput = {
        team: teamId,
        name: name,
      };
      const response = await createCategory(requestData);

      if (response.status === 201) {
        setNewCategoryName("");
        const newCategory: CategoryNameDTO = {
          id: response.data.id || "",
          name: response.data.name || "",
        };
        setCategories((prevTags) => [...prevTags, newCategory]);
      }
    } catch (error) {
      toaster.error({
        title: "카테고리 생성 실패",
      });
    }
  };

  useEffect(() => {
    getCategories({ teamId });
  }, []);

  const cateogoryList = useMemo(() => {
    return createListCollection({
      items: categories || [],
      itemToString: (item: CategoryNameDTO) => item.name,
      itemToValue: (item: CategoryNameDTO) => item.id,
    });
  }, [categories]);
  return (
    <SelectRoot
      size="sm"
      name="category"
      width="100%"
      value={[value]}
      collection={cateogoryList}
      onValueChange={(selectedItems) => {
        onValueChange(selectedItems.items[0].id);
      }}
    >
      <SelectTrigger>
        <SelectTagItem />
      </SelectTrigger>
      <SelectContent portalled={false}>
        {cateogoryList.items.map((categoryItem) => (
          <SelectItem
            item={categoryItem}
            key={categoryItem.id}
            justifyContent="flex-start"
            padding={1}
          >
            <TagItem id={categoryItem.id} name={categoryItem.name} size="sm" />
          </SelectItem>
        ))}

        <PopoverRoot>
          <PopoverTrigger asChild>
            <IconButton size="xs">
              <LuPlus />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent portalled={false}>
            <HStack padding="12px">
              <Input
                padding="12px"
                placeholder="새 카테고리 이름"
                value={newCategoryName || ""}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <IconButton
                size="xs"
                onClick={() => createNewCategory({ name: newCategoryName })}
              >
                <LuPlus />
              </IconButton>
            </HStack>
          </PopoverContent>
        </PopoverRoot>
      </SelectContent>
    </SelectRoot>
  );
};

export default CategorySelector;
