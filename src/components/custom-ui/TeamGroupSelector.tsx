import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection, HStack } from "@chakra-ui/react";

import { TagItem } from "./Tag";
import { TeamGroupDTO } from "@/lib/api/interface/fetchDTOs";
import { useEffect, useMemo, useState } from "react";
import { getTeamGroupList } from "@/lib/api/getApi";

interface TeamGroupSelectorProps {
  teamId: string;
  value: string[];
  onValueChange: (items: string[]) => void;
}
const SelectTagItem = () => (
  <SelectValueText padding={2} width="3xs">
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

const TeamGroupSelector = ({
  teamId,
  value,
  onValueChange,
}: TeamGroupSelectorProps) => {
  const [teamGroupList, setTeamGroupList] = useState<TeamGroupDTO[]>([]);

  useEffect(() => {
    const fetchTeamGroups = async () => {
      try {
        const response = await getTeamGroupList({
          teamId: teamId,
        });
        console.log(response);
        setTeamGroupList(response.data.results);
      } catch (error) {
        console.error("Failed to fetch role groups", error);
      }
    };

    fetchTeamGroups();
  }, [teamId]);

  const teamGroupCollections = useMemo(() => {
    return createListCollection({
      items: teamGroupList || [],
      itemToString: (item: TeamGroupDTO) => item.name,
      itemToValue: (item: TeamGroupDTO) => item.id,
    });
  }, [teamGroupList]);

  return (
    <SelectRoot
      multiple
      size="sm"
      name="category"
      width="100%"
      value={value}
      collection={teamGroupCollections}
      onValueChange={(selectedItem) => {
        onValueChange(selectedItem.items.map((item) => item.id));
      }}
    >
      <SelectTrigger>
        <SelectTagItem />
      </SelectTrigger>
      <SelectContent portalled={false} padding={2} gap={2}>
        {teamGroupCollections.items.map((roleGroup) => (
          <SelectItem item={roleGroup} key={roleGroup.id}>
            <TagItem
              key={roleGroup.id}
              id={roleGroup.id}
              name={roleGroup.name}
              size="md"
            />
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default TeamGroupSelector;
