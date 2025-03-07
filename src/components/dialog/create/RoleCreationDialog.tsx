"use client";

import { useState } from "react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Button,
  Box,
  Card,
  CardRoot,
  Field,
  Input,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { createTeamGroup } from "@/lib/api/postApi";
import { toaster } from "../../ui/toaster";

const RoleCreationDialog = () => {
  const params = useParams();
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [roleName, setRoleName] = useState<string>("");

  const handleClick = async () => {
    try {
      const response = createTeamGroup({ team: teamId, name: roleName });
      toaster.promise(response, {
        success: {
          title: "역할 생성 성공",
          description: "역할이 성공적으로 생성되었습니다",
        },
        error: {
          title: "역할 생성 실패",
          description: "역할 생성에 실패했습니다",
        },
        loading: {
          title: "역할 생성 중",
          description: "잠시만 기다려주세요...",
        },
      });
    } catch (error) {
      toaster.error({
        title: "역할 생성 실패",
        description: "역할 생성 중 오류가 발생했습니다.",
      });
      console.error("Error creating role:", error);
    }
  };

  return (
    <DialogRoot placement="center">
      <DialogTrigger asChild>
        <Button>Create Role</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogCloseTrigger />
        <DialogBody>
          <Card.Root padding={10}>
            <Card.Body>
              <Field.Root>
                <Field.Label>
                  <Field.RequiredIndicator />
                  이름
                </Field.Label>
                <Input
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                <Field.ErrorText />
              </Field.Root>
            </Card.Body>
          </Card.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={handleClick}>Create</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default RoleCreationDialog;
