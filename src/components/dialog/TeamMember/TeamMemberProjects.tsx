"use client";

import { useState, useEffect } from "react";
import { fetchProjectList, fetchProjectMemberList } from "@/lib/api/fetchApi";
import {
  ProjectDTO,
  ProjectMemberDTO,
  TeamMemberDTO,
} from "@/lib/api/interface/fetchDTOs";
import { formatToKST } from "@/lib/util/dateFormat";
import { IconButton, Stack, Table, Tag } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";

const headers = ["제목", "설명", "분류", "시작일", "종료일"];

interface TeamMemberProjectProps {
  teamMember: TeamMemberDTO;
}

const TeamMemberProjectTable = ({ teamMember }: TeamMemberProjectProps) => {
  const router = useRouter();
  const [projectMemberList, setProjectMemberList] = useState<
    ProjectMemberDTO[]
  >([]);

  const handleButtonClick = (projectId: string) => {
    router.push(`/workspace/project/${projectId}`);
  };

  const loadProjects = async () => {
    const response = await fetchProjectMemberList({
      memberId: teamMember.member.id,
      teamId: teamMember.team.id,
    });
    setProjectMemberList(response.data.results);
  };

  useEffect(() => {
    loadProjects();
  }, [teamMember]);

  return (
    <Stack>
      <Table.Root size="lg" borderRadius="md" border="1px">
        <Table.Header fontSize="sm" textAlign="center">
          <Table.Row>
            {headers.map((header, index) => (
              <Table.ColumnHeader
                key={index}
                padding={4}
                borderBottom="2px"
                textAlign="center"
              >
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {projectMemberList.length > 0 &&
            projectMemberList.map((projectMember, index) => (
              <Table.Row
                key={projectMember.project.id}
                cursor="pointer"
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <Table.Cell padding={4} align="center">
                  {projectMember.project.name}
                </Table.Cell>
                <Table.Cell padding={4} align="center">
                  {projectMember.project.description}
                </Table.Cell>

                <Table.Cell padding={4} align="center">
                  {projectMember.project.description}
                </Table.Cell>
                <Table.Cell padding={4} align="center">
                  <Tag.Root>
                    <Tag.Label>
                      {projectMember.project.category
                        ? projectMember.project.category.name
                        : "-"}
                    </Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  {formatToKST({
                    dateString: projectMember.project.start_date,
                  })}
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  {projectMember.project.end_date
                    ? formatToKST({
                        dateString: projectMember.project.end_date,
                      })
                    : "-"}
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  <IconButton
                    onClick={() => handleButtonClick(projectMember.project.id)}
                  >
                    <LuChevronRight />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default TeamMemberProjectTable;
