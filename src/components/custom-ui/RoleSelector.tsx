import { HStack, Icon } from "@chakra-ui/react";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";
import {
  LuArrowRight,
  LuCircleOff,
  LuEye,
  LuLock,
  LuPencil,
} from "react-icons/lu";

interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const RoleRadioCard = ({ value, onValueChange }: RoleSelectorProps) => {
  return (
    <RadioCardRoot
      defaultValue={value}
      onValueChange={(e) => onValueChange(e.value)}
    >
      <RadioCardLabel>Select permission</RadioCardLabel>
      <HStack align="stretch">
        {items.map((item) => (
          <RadioCardItem
            icon={
              <Icon fontSize="2xl" color="fg.muted" mb="2">
                {item.icon}
              </Icon>
            }
            label={item.title}
            description={item.description}
            key={item.value}
            value={item.value}
          />
        ))}
      </HStack>
    </RadioCardRoot>
  );
};

const items = [
  {
    icon: <LuArrowRight />,
    value: "manager",
    title: "관리",
    description: "이 사용자는 모든 권한을 가집니다.",
  },
  {
    icon: <LuPencil />,
    value: "editor",
    title: "수정",
    description: "이 사용자는 콘텐츠를 수정할 수 있습니다.",
  },
  {
    icon: <LuEye />,
    value: "viewer",
    title: "보기",
    description: "이 사용자는 콘텐츠를 읽기만 할 수 있습니다.",
  },
  {
    icon: <LuLock />,
    value: "guest",
    title: "게스트",
    description: "이 사용자는 일부 게시물에만 접근할 수 있습니다.",
  },
];

export { RoleRadioCard };
