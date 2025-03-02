"use client";
import React from "react";
import { Editable, IconButton } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { useRole } from "@/lib/context/RoleContext";

interface Props {
  onValueRevert: () => void;
  onValueCommit: () => void;
  preview: React.ReactNode;
  edit: React.ReactNode;
}

const EditableData: React.FC<Props> = ({
  onValueRevert,
  onValueCommit,
  preview,
  edit,
}) => {
  const { role, setRole } = useRole();

  return (
    <Editable.Root onValueRevert={onValueRevert} onValueCommit={onValueCommit}>
      <Editable.Area width="100%">
        <Editable.Context>
          {(editable) => (
            <Editable.Control>
              {editable.editing ? <>{edit}</> : <>{preview}</>}
            </Editable.Control>
          )}
        </Editable.Context>
      </Editable.Area>
      {role !== "viewer" && (
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      )}
    </Editable.Root>
  );
};

export default EditableData;
