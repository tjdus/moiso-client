"use client";
import { useState } from "react";
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
import { signup } from "@/lib/api/login";

export default function Signup() {
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDTO>();

  const onSubmit = handleSubmit(async (data) => {
    const result = await signup(data);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.message ?? "");
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

              <Button type="submit">Submit</Button>
            </Stack>
          </form>

          <Link href="/login">login</Link>
        </Box>
      </Stack>
    </Flex>
  );
}
