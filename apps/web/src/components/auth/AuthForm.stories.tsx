import type { Meta, StoryObj } from "@storybook/react";
import AuthForm from "./AuthForm";

const meta: Meta<typeof AuthForm> = {
  title: "Auth/AuthForm",
  component: AuthForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof AuthForm>;

export const Login: Story = {
  args: {
    mode: "login",
  },
};

export const Signup: Story = {
  args: {
    mode: "signup",
  },
};




