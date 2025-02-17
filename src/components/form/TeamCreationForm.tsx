import { Button, Input, Fieldset, Stack, HStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { createTeam } from "@/lib/api/postApi";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

const TeamCreationForm = () => {
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    const response = createTeam({ name: teamName });
    toaster.promise(response, {
      success: {
        title: "팀 생성 성공",
        description: "새로운 팀이 생성되었습니다",
      },
      error: {
        title: "팀 생성 실패",
        description: "팀 생성에 실패했습니다",
      },
      loading: {
        title: "팀 생성 중",
        description: "잠시만 기다려주세요...",
      },
    });
  };

  return (
    <Fieldset.Root>
      <DialogHeader>팀 만들기</DialogHeader>
      <DialogBody>
        <Fieldset.Content>
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Field label="이름">
              <Input
                padding="12px"
                value={teamName}
                placeholder="팀 이름을 입력해주세요"
                onChange={(e) => setTeamName(e.target.value)}
              />
            </Field>
          </Stack>
        </Fieldset.Content>
      </DialogBody>
      <DialogFooter>
        <DialogCloseTrigger />
        <HStack gap={2}>
          <DialogActionTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button
              type="submit"
              onClick={handleCreateTeam}
              colorScheme="blue"
              px={4}
            >
              만들기
            </Button>
          </DialogActionTrigger>
        </HStack>
      </DialogFooter>
    </Fieldset.Root>
  );
};

export default TeamCreationForm;
