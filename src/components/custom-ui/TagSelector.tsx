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
import { TagDTO } from "@/lib/api/interface/fetchDTOs";
import { fetchTagList } from "@/lib/api/fetchApi";
import { toaster } from "../ui/toaster";
import { createTag } from "@/lib/api/postApi";
import { TagForm } from "@/lib/api/interface/form";

interface TagSelectorProps {
  projectId: string;
  value: TagDTO[];
  onValueChange: (items: TagDTO[]) => void;
}

const SelectTagItem = () => (
  <SelectValueText placeholder="태그를 선택하세요" width="3xs">
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

const TagSelector = ({ projectId, value, onValueChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [newTagName, setNewTagName] = useState<string>("");

  const getTags = async ({ projectId }: { projectId: string }) => {
    try {
      const response = await fetchTagList({ projectId });
      setTags(response.data.results);
    } catch (error) {
      toaster.error({
        title: "태그 불러오기 실패",
        description: "태그를 불러오는 데 실패했습니다",
      });
    }
  };

  const createNewTag = async ({ name }: { name: string }) => {
    try {
      const requestData: TagForm = {
        project: projectId,
        name: name,
      };
      const response = await createTag(requestData);

      if (response.status === 201) {
        setNewTagName("");
        const newTag: TagDTO = {
          id: response.data.id || "",
          name: response.data.name || "",
        };
        setTags((prevTags) => [...prevTags, newTag]);
      }
    } catch (error) {
      toaster.error({
        title: "태그 생성 실패",
        description: "태그를 생성하는 데 실패했습니다",
      });
    }
  };

  useEffect(() => {
    getTags({ projectId });
  }, []);

  const tagList = useMemo(() => {
    return createListCollection({
      items: tags || [],
      itemToString: (item: TagDTO) => item.name,
      itemToValue: (item: TagDTO) => item.id,
    });
  }, [tags]);
  return (
    <SelectRoot
      multiple
      size="sm"
      name="category"
      width="100%"
      value={value.map((tag) => tag.id)}
      collection={tagList}
      onValueChange={(selectedItem) => {
        onValueChange(
          selectedItem.items.map((item) => ({ id: item.id, name: item.name }))
        );
      }}
    >
      <SelectTrigger>
        <SelectTagItem />
      </SelectTrigger>
      <SelectContent portalled={false}>
        {tagList.items.map((tagItem) => (
          <SelectItem
            item={tagItem}
            key={tagItem.id}
            justifyContent="flex-start"
            padding={1}
          >
            <TagItem id={tagItem.id} name={tagItem.name} size="sm" />
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
                placeholder="새 태그 이름"
                value={newTagName || ""}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <IconButton
                size="xs"
                onClick={() => createNewTag({ name: newTagName })}
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

export default TagSelector;
