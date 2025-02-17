"use client"

import {
    DialogContent,
    DialogRoot,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button, Box } from "@chakra-ui/react";
import TeamCreationForm from "@/components/form/TeamCreationForm";
import CreationDialog from "./CreationDialog";

const TeamCreationDialog = () => {
    return (
        <CreationDialog>
            <TeamCreationForm />
        </CreationDialog>
    );
};

export default TeamCreationDialog;
