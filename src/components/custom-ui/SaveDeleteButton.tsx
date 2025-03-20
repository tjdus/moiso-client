import {
  Button,
  ButtonGroup,
  Card,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { LuSave, LuTrash2 } from "react-icons/lu";
import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogBody,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRole } from "@/lib/context/RoleContext";

interface SaveDeleteButtonProps {
  onSave: () => void;
  onDelete: () => void;
}

const SaveDeleteButton: React.FC<SaveDeleteButtonProps> = ({
  onSave,
  onDelete,
}) => {
  const { role, setRole } = useRole();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  return (
    <ButtonGroup gap={2}>
      <IconButton
        colorPalette="gray"
        onClick={onSave}
        variant="surface"
        disabled={role === "viewer"}
      >
        <LuSave />
      </IconButton>
      <IconButton
        colorPalette="red"
        onClick={handleDelete}
        variant="surface"
        disabled={role === "viewer"}
      >
        <LuTrash2 />
      </IconButton>
      <DialogRoot
        size="sm"
        open={isAlertOpen}
        onOpenChange={(details) => setIsAlertOpen(details.open)}
        role="alertdialog"
      >
        <DialogContent mt={40}>
          <Card.Root>
            <Card.Body>
              <DialogBody padding={10}>
                <Text textStyle="sm">삭제하시겠습니까?</Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="red" onClick={onDelete}>
                  삭제
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </Card.Body>
          </Card.Root>
        </DialogContent>
      </DialogRoot>
    </ButtonGroup>
  );
};

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  const { role, setRole } = useRole();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  return (
    <ButtonGroup gap={2}>
      <IconButton
        colorPalette="red"
        onClick={handleDelete}
        variant="surface"
        disabled={role === "viewer"}
      >
        <LuTrash2 />
      </IconButton>
      <DialogRoot
        size="sm"
        open={isAlertOpen}
        onOpenChange={(details) => setIsAlertOpen(details.open)}
        role="alertdialog"
      >
        <DialogContent mt={40}>
          <Card.Root>
            <Card.Body>
              <DialogBody padding={10}>
                <Text textStyle="sm">삭제하시겠습니까?</Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="red" onClick={onDelete}>
                  삭제
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </Card.Body>
          </Card.Root>
        </DialogContent>
      </DialogRoot>
    </ButtonGroup>
  );
};

interface WarnDialogProps {
  trigger: React.ReactNode;
  confirmDelete: () => void;
}

const WarnDialog = ({ trigger, confirmDelete }: WarnDialogProps) => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent mt={40}>
        <Card.Root>
          <Card.Body>
            <DialogBody padding={10}>
              <Text textStyle="sm">삭제하시겠습니까?</Text>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button colorPalette="red" onClick={confirmDelete}>
                삭제
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </Card.Body>
        </Card.Root>
      </DialogContent>
    </DialogRoot>
  );
};

export { SaveDeleteButton, DeleteButton, WarnDialog };
