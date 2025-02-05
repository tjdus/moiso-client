"use client";
import { useState } from "react";
import { Button, Stack, StackSeparator } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TeamDTO {
  name: string;
}

const teams = [{ name: "Team1" }, { name: "Team2" }];

function TeamItem({ team }: { team: TeamDTO }) {
  return <Button>{team.name}</Button>;
}

export default function TeamSelectOption() {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <PopoverTrigger asChild>
        <Button aria-label="More server options" variant="solid" size="2xl">
          Team
        </Button>
      </PopoverTrigger>
      <PopoverContent minWidth="220px" p={4} borderRadius="md" boxShadow="lg">
        <PopoverArrow />
        <PopoverBody>
          <Stack separator={<StackSeparator />}>
            {teams.map((team) => (
              <TeamItem key={team.name} team={team} />
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
