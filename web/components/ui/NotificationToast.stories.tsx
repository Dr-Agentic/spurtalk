import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./sonner";
import { showNotification } from "./NotificationToast";
import { Button } from "./button";

const NotificationDemo = () => {
    return (
        <div className="p-8 space-y-4">
            <Toaster />
            <div className="flex flex-wrap gap-4">
                <Button
                    onClick={() => showNotification({
                        variant: "success",
                        message: "You did it! That's a huge win! 🎉"
                    })}
                >
                    Success Notification
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => showNotification({
                        variant: "info",
                        message: "Just a gentle nudge: you're doing great! 💡"
                    })}
                >
                    Info Notification
                </Button>
                <Button
                    variant="outline"
                    onClick={() => showNotification({
                        variant: "attention",
                        message: "A quick star for your progress! ⭐"
                    })}
                >
                    Attention Notification
                </Button>
            </div>
        </div>
    );
};

const meta: Meta<typeof NotificationDemo> = {
    title: "UI/NotificationToast",
    component: NotificationDemo,
};

export default meta;
type Story = StoryObj<typeof NotificationDemo>;

export const Default: Story = {};
