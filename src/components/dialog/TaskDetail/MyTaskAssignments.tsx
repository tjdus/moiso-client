import react, { useEffect, useState } from "react";

import { TaskAssignmentDTO } from "@/lib/api/interface/fetchDTOs";

import { toaster } from "@/components/ui/toaster";
import {
  DataList,
  DataListItemValue,
  EditablePreview,
  EditableRoot,
  Editable,
  HStack,
  EmptyState,
  IconButton,
  Card,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { TaskAssignmentInput } from "@/lib/api/interface/requestDTO";
import { StatusTag } from "@/components/custom-ui/Tag";
import { LuClipboardX, LuPencilLine, LuX, LuCheck } from "react-icons/lu";
import { getMyTaskAssignmentList } from "@/lib/api/getApi";

const editableControl = (
  <Editable.Control>
    <Editable.EditTrigger asChild>
      <IconButton variant="ghost" size="xs">
        <LuPencilLine />
      </IconButton>
    </Editable.EditTrigger>
    <Editable.CancelTrigger asChild>
      <IconButton variant="outline" size="xs">
        <LuX />
      </IconButton>
    </Editable.CancelTrigger>
    <Editable.SubmitTrigger asChild>
      <IconButton variant="outline" size="xs">
        <LuCheck />
      </IconButton>
    </Editable.SubmitTrigger>
  </Editable.Control>
);

const MyTaskAssignments = ({ taskId }: { taskId: string }) => {
  const [taskAssignment, setTaskAssignment] =
    useState<TaskAssignmentDTO | null>(null);
  const [taskForm, setTaskForm] = useState<TaskAssignmentInput>({});

  useEffect(() => {
    fetchTaskAssignments();
  }, [taskId]);

  const fetchTaskAssignments = async () => {
    try {
      const response = await getMyTaskAssignmentList({ taskId });
      setTaskAssignment(response.data.results[0]);
    } catch (error) {
      toaster.error({
        title: "",
        description: "업무 목록 작업 중 에러가 발생했습니다.",
      });
    }
  };

  return (
    <Card.Root padding={10}>
      <Card.Body>
        {taskAssignment ? (
          <DataList.Root orientation="horizontal" gap={10}>
            <DataList.Item>
              <DataList.ItemLabel>진행 상태</DataList.ItemLabel>
              <DataListItemValue>
                <Editable.Root
                  defaultValue={taskAssignment.status}
                  value={taskAssignment.status}
                  onValueRevert={() =>
                    setTaskForm({
                      ...taskForm,
                      status: taskAssignment.status,
                    })
                  }
                >
                  <Editable.Preview>
                    <StatusTag
                      status={taskForm.status || "not_started"}
                      size="sm"
                    />
                  </Editable.Preview>
                  <Editable.Area>
                    <Editable.Context>
                      {(editable) => (
                        <Editable.Control>
                          {editable.editing ? (
                            <RadioGroup
                              value={taskForm.status}
                              onValueChange={(e) => {
                                setTaskForm({
                                  ...taskForm,
                                  status: e.value,
                                });
                              }}
                            >
                              <HStack gap={2}>
                                <Radio value="not_started">
                                  <StatusTag status="not_started" size="md" />
                                </Radio>
                                <Radio value="in_progress">
                                  <StatusTag status="in_progress" size="md" />
                                </Radio>
                                <Radio value="completed">
                                  <StatusTag status="completed" size="md" />
                                </Radio>
                              </HStack>
                            </RadioGroup>
                          ) : (
                            <></>
                          )}
                        </Editable.Control>
                      )}
                    </Editable.Context>
                  </Editable.Area>
                  {editableControl}
                </Editable.Root>
              </DataListItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>생성자</DataList.ItemLabel>
              <DataListItemValue></DataListItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>수정자</DataList.ItemLabel>
              <DataListItemValue></DataListItemValue>
            </DataList.Item>
          </DataList.Root>
        ) : (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuClipboardX />
              </EmptyState.Indicator>
              {/* <EmptyState.Title /> */}
              <EmptyState.Description>
                업무가 배정되지 않았어요.
              </EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default MyTaskAssignments;
