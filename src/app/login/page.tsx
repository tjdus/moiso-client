"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { LoginDTO } from "@/lib/interface/login";
import { login } from "@/lib/api/login";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>();

  const onSubmit = handleSubmit(async (data) => {
    const result = await login(data);
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
        <Heading size="4xl">Login</Heading>
        <Box
          maxW="md"
          minW="md"
          mx="auto"
          mt={10}
          p={6}
          borderRadius="md"
          boxShadow="lg"
          bg="white"
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
                  p={2}
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
                  p={2}
                />
              </Field>

              <Button type="submit">Login</Button>
            </Stack>
          </form>
        </Box>
        <Text>
          Don't have an account?{" "}
          <Link variant="underline" href="/signup" colorPalette="teal">
            Sing up
          </Link>{" "}
          here
        </Text>
      </Stack>
    </Flex>
  );
}
