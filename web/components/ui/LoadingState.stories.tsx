import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "UI/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["spinner", "skeleton", "progress"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Spinner: Story = {
  args: {
    variant: "spinner",
    message: "Preparing something nice for you...",
  },
};

export const Skeleton: Story = {
  args: {
    variant: "skeleton",
    message: "Gathering your tasks...",
  },
};

export const Progress: Story = {
  args: {
    variant: "progress",
    message: "Looking for small wins...",
  },
};

export const DelayedMessage: Story = {
  args: {
    variant: "spinner",
    showMessageDelay: 1000, // Short delay for demonstration
  },
};

export const Small: Story = {
  args: {
    variant: "spinner",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    variant: "spinner",
    size: "lg",
  },
};
