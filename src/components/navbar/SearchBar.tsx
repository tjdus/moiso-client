import { HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuSearch } from "react-icons/lu";
import TaskCreationDialog from "../dialog/create/TaskCreationDialog";

const TaskSearchBar = () => {
  return (
    <HStack gap="10" width="full">
      <InputGroup flex="1" startElement={<LuSearch />}>
        <Input placeholder="검색하기" />
      </InputGroup>
      <TaskCreationDialog />
    </HStack>
  );
};

export default TaskSearchBar;
