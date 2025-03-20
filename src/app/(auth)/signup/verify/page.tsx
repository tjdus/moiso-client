"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SignupDTO } from "@/lib/api/interface/login";
import { notFound, redirect, useSearchParams } from "next/navigation";
import { getInvitation, signupWithInvitation } from "@/lib/api/login";
import { toaster } from "@/components/ui/toaster";

export default function SignupVerify() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [id, setId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<SignupDTO>();

  const password = watch("password");

  useEffect(() => {
    if (token) {
      const fetchInvitation = async () => {
        const response = await getInvitation(token);
        console.log(response);
        if (response.status === 200) {
          setValue("email", response.data.email);
          setId(response.data.id);
          if (!response.data.is_valid) {
            toaster.error({
              title: "유효하지 않은 초대장입니다.",
            });
            redirect("/");
          }
        }
      };

      fetchInvitation();
    }
  }, [token, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signupWithInvitation({ ...data, id });
      if (response.status === 200) {
        toaster.success({
          title: "회원가입 성공",
        });
        redirect("/login");
      } else if (response.status === 400) {
        const errors = response.error || {};
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((error: any, index: number) => {
            toaster.error({
              title: `Error in ${key}`,
              description: error,
            });
            setError(key as keyof SignupDTO, {
              type: "server",
              message: error,
            });
          });
        });
      } else {
        toaster.error({
          title: "회원가입 중 문제가 발생했습니다",
        });
      }
    } catch (error) {
      toaster.error({
        title: "회원가입 중 문제가 발생했습니다",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="4xl">Welcome</Heading>
        <Box
          maxW="md"
          minW="md"
          mx="auto"
          mt={10}
          p={6}
          borderRadius="md"
          boxShadow="lg"
        >
          <form onSubmit={onSubmit}>
            <Stack
              flexDir="column"
              mb="2"
              justifyContent="center"
              alignItems="center"
            >
              <Field
                label="Username"
                invalid={!!errors.username}
                errorText={errors.username?.message}
              >
                <Input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="username"
                />
              </Field>

              <Field
                label="Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
              >
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="name"
                />
              </Field>

              <Field
                label="Email"
                invalid={!!errors.email}
                errorText={errors.email?.message}
              >
                <Input
                  {...register("email", { required: "Email is required" })}
                  placeholder="email"
                />
              </Field>

              <Field
                label="Password"
                invalid={!!errors.password}
                errorText={errors.password?.message}
              >
                <PasswordInput
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
              </Field>

              <Field
                label="비밀번호 확인"
                invalid={!!errors.confirmedPassword}
                errorText={errors.confirmedPassword?.message}
              >
                <PasswordInput
                  {...register("confirmedPassword", {
                    required: "Confirmation password is required",
                    validate: (value) =>
                      value === password || "비밀번호가 일치하지 않습니다.",
                  })}
                />
              </Field>

              <Button type="submit" loading={isSubmitting}>
                Submit
              </Button>
            </Stack>
          </form>

          <Text mt={4} textAlign="center">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" color="blue.500">
              로그인
            </Link>
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
}
