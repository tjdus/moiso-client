"use client";

import { VStack, HStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import ScrollableNumberPicker from "./ScrollableNumberPicker";
import ScrollableAmPmPicker from "./ScrollableAmPmPicker";

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

interface TimePickerProps {
  onClose: () => void;
  onTimeChange: (time: { hours: number; minutes: number }) => void;
}

export default function TimePicker({ onClose, onTimeChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedAmPm, setSelectedAmPm] = useState(0);

  const handleConfirm = () => {
    const hours24 =
      selectedAmPm === 0
        ? selectedHour === 11
          ? 0
          : selectedHour + 1
        : selectedHour === 11
        ? 12
        : selectedHour + 13;
    onTimeChange({ hours: hours24, minutes: selectedMinute });
    onClose();
  };

  return (
    <VStack gap={4} align="center">
      <HStack gap={4}>
        <ScrollableNumberPicker
          list={hours}
          selected={selectedHour}
          onSelect={setSelectedHour}
        />
        <Text fontSize="2xl">:</Text>
        <ScrollableNumberPicker
          list={minutes}
          selected={selectedMinute}
          onSelect={setSelectedMinute}
        />
        <ScrollableAmPmPicker
          selected={selectedAmPm}
          onSelect={setSelectedAmPm}
        />
      </HStack>
      <Button onClick={handleConfirm}>확인</Button>
    </VStack>
  );
}
