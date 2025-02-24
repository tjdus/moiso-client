import { ProjectDTO } from "@/lib/interface/fetchDTOs";
import { formatToKST } from "@/lib/util/dateFormat";
import { IconButton, Stack, Table, Tag } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";

const headers = ["제목", "설명", "분류", "시작일", "종료일"];

const TeamMemberProjectTable = ({ projects }: { projects: ProjectDTO[] }) => {
  const router = useRouter();

  const handleButtonClick = (projectId: string) => {
    router.push(`/workspace/project/${projectId}`);
  };

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
          {projects.length > 0 &&
            projects.map((project, index) => (
              <Table.Row
                key={project.id}
                cursor="pointer"
                _hover={{ backgroundColor: "brand.200" }}
                borderBottom="1px"
                fontSize="sm"
              >
                <Table.Cell padding={4} align="center">
                  {project.name}
                </Table.Cell>

                <Table.Cell padding={4} align="center">
                  {project.description}
                </Table.Cell>
                <Table.Cell padding={4} align="center">
                  <Tag.Root>
                    <Tag.Label>
                      {project.category ? project.category.name : "-"}
                    </Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  {formatToKST({ dateString: project.start_date })}
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  {project.end_date
                    ? formatToKST({ dateString: project.end_date })
                    : "-"}
                </Table.Cell>
                <Table.Cell padding={4} textAlign="center" fontSize="xs">
                  <IconButton onClick={() => handleButtonClick(project.id)}>
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
