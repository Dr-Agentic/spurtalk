import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuickStats } from "./QuickStats";

const meta: Meta<typeof QuickStats> = {
  title: "Dashboard/QuickStats",
  component: QuickStats,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuickStats>;

export const Default: Story = {
  args: {
    streak: 5,
    todayWins: 3,
    gardenGrowth: 12,
  },
};

export const ZeroStats: Story = {
  args: {
    streak: 0,
    todayWins: 0,
    gardenGrowth: 0,
  },
};

export const HighStats: Story = {
  args: {
    streak: 100,
    todayWins: 10,
    gardenGrowth: 250,
  },
};
