import { Button, TextInput, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import axios from "axios";

import { AuthLayout } from "@/layouts/authLayout/AuthLayout";
import { TitleWrapper } from "@/components/titleWrapper/TitleWrapper";
import { protectRoute } from "@/protectedRoutes";
import { camelToSnake } from "@/utils";

type FormValues = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
};

export default function RegisterPage() {
    const router = useRouter();

    const { mutate, isLoading, error } = useMutation("registerUser", registerUser, {
        onSuccess: async () => {
            await router.push("/login");
        },
    });

    const form = useForm<FormValues>({
        initialValues: { username: "", email: "", firstName: "", lastName: "", repeatPassword: "", password: "" },

        // functions will be used to validate values at corresponding key
        validate: {
            username: (value) => (value.length < 2 ? "Username must have at least 2 characters" : null),
            email: (value) =>
                !/\S+@\S+\.\S+/.test(value) ? "Please enter a valid email address" : null,
            firstName: (value) => (value.length < 2 ? "Name must have at least 2 characters" : null),
            lastName: (value) => (value.length < 2 ? "Name must have at least 2 characters" : null),
            password: (value) => (value.length < 8 ? "Name must have at least 8 characters" : null),
            repeatPassword: (value, values) =>
                value !== values.password ? "Passwords do not match" : null,
        },
    });

    async function registerUser(formData: FormValues) {
        const { repeatPassword, ...others } = formData;

        const { data } = await axios.post("http://localhost:8000/api/v1/users", camelToSnake(others));
        return data;
    }

    function onSubmit(formData: FormValues) {
        mutate(formData);
    }

    return (
        <AuthLayout>
            <TitleWrapper title={"Register"}/>

            <form className={"flex flex-col gap-4"} onSubmit={form.onSubmit(onSubmit)}>
                <TextInput
                    label={"Username"}
                    placeholder={"Username"}
                    {...form.getInputProps("username")}
                />

                <TextInput
                    label={"First name"}
                    placeholder={"First name"}
                    {...form.getInputProps("firstName")}
                />

                <TextInput
                    label={"Last name"}
                    placeholder={"Last name"}
                    {...form.getInputProps("lastName")}
                />

                <TextInput
                    label={"Email"}
                    placeholder={"Email"}
                    type={"email"}
                    {...form.getInputProps("email")}
                />

                <PasswordInput
                    label={"Password"}
                    placeholder={"Password"}
                    {...form.getInputProps("password")}
                />

                <PasswordInput
                    label={"Repeat password"}
                    placeholder={"Repeat password"}
                    {...form.getInputProps("repeatPassword")}
                />

                <Button type={"submit"} variant={"outline"} disabled={isLoading || (!form.isValid && form.isTouched)}>Submit</Button>
            </form>
        </AuthLayout>
    );
}

export const getServerSideProps = protectRoute;