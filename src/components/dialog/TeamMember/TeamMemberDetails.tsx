"use client";

import { fetchMemberDetail } from "@/lib/api/fetchApi";
import { MemberDTO, TeamMemberDetailDTO } from "@/lib/interface/fetchDTOs";
import { Card, DataList, Tag } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { RoleBadge } from "../../custom-ui/RoleBadge";
import { Role } from "@/lib/interface/common";

const TeamMemberDetails = ({
  member,
  projects,
  role_groups,
}: TeamMemberDetailDTO) => {
  return (
    <Card.Root padding={10}>
      <Card.Body>
        <DataList.Root orientation="horizontal">
          <DataList.Item>
            <DataList.ItemLabel>이름</DataList.ItemLabel>
            <DataList.ItemValue>{member.member.name}</DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>이메일</DataList.ItemLabel>
            <DataList.ItemValue>{member.member.email}</DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>역할</DataList.ItemLabel>
            <DataList.ItemValue>
              {role_groups.map((role, index) => (
                <Tag.Root key={role.id}>
                  <Tag.Label>{role.name}</Tag.Label>
                </Tag.Root>
              ))}
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>권한</DataList.ItemLabel>
            <DataList.ItemValue>
              <RoleBadge role={member.role as Role} />
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel>가입일</DataList.ItemLabel>
            <DataList.ItemValue>{member.joined_at}</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default TeamMemberDetails;
