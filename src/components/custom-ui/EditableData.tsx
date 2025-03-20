"use client";
import React from "react";
import { Editable, IconButton } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuX, LuCheck, LuPencilLine } from "react-icons/lu";
import { useRole } from "@/lib/context/RoleContext";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  onValueRevert?: () => void;
  onValueCommit?: () => void;
  preview: (value: any) => React.ReactNode;
  edit: (value: any, onValueChange: (value: any) => void) => React.ReactNode;
}

const EditableData = <T extends FieldValues = FieldValues>({
  name,
  control,
  onValueRevert,
  onValueCommit,
  preview,
  edit,
}: Props<T>) => {
  const { role, setRole } = useRole();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Editable.Root
          onValueRevert={onValueRevert}
          onValueCommit={onValueCommit}
        >
          <Editable.Area width="100%">
            <Editable.Context>
              {(editable) => (
                <Editable.Control>
                  {editable.editing
                    ? edit(field.value, field.onChange)
                    : preview(field.value)}
                </Editable.Control>
              )}
            </Editable.Context>
          </Editable.Area>
          {role && role !== "viewer" && (
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
      )}
    />
  );
};

export default EditableData;
