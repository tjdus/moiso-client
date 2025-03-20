import { useState } from "react";
import {
  Button,
  Card,
  Dialog,
  Field,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { LuUserRoundPlus } from "react-icons/lu";

const InviteDialog = ({ projectId }: { projectId: string }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  // Simple email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (isInvalid && validateEmail(e.target.value)) {
      setIsInvalid(false);
    }
  };

  const handleInvite = async () => {
    if (!validateEmail(email)) {
      setIsInvalid(true);
      return;
    }

    setIsLoading(true);
    try {
      toaster.success({
        title: "초대 메일이 성공적으로 전송되었습니다.",
      });
      setEmail(""); // Clear the input
    } catch (error) {
      toaster.error({
        title: "초대 메일 발송에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton>
          <LuUserRoundPlus />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content padding={4} top="20%">
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>프로젝트 초대</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Field.Root invalid={isInvalid}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={handleEmailChange}
              />
              {isInvalid && (
                <Field.ErrorText>
                  이메일 형식이 올바르지 않습니다.
                </Field.ErrorText>
              )}
            </Field.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button>취소</Button>
            </Dialog.ActionTrigger>
            <Button
              onClick={handleInvite}
              loading={isLoading}
              colorScheme="blue"
            >
              초대하기
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default InviteDialog;
