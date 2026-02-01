"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Palette, Eye, Shield, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "preferences" | "notifications" | "accessibility" | "privacy";

const SECTIONS = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
    { id: "notifications" as const, label: "Reminders", icon: Bell },
    { id: "accessibility" as const, label: "Accessibility", icon: Eye },
    { id: "privacy" as const, label: "Privacy & Data", icon: Shield },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto max-w-4xl px-4 py-8"
        >
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-h2 text-foreground flex items-center gap-2">
                    <Settings className="h-7 w-7 text-primary" />
                    Settings
                </h1>
                <p className="mt-2 text-body-small text-muted-foreground">
                    Customize your SpurTalk experience
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                {/* Sidebar */}
                <nav className="flex flex-col gap-1">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <Button
                                key={section.id}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "justify-start gap-2",
                                    isActive && "bg-primary/10 text-primary"
                                )}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <Icon className="h-4 w-4" />
                                {section.label}
                            </Button>
                        );
                    })}

                    <Separator className="my-2" />

                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => window.location.href = "/pricing"}
                    >
                        <CreditCard className="h-4 w-4" />
                        Subscription
                    </Button>
                </nav>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeSection === "profile" && <ProfileSection />}
                    {activeSection === "preferences" && <PreferencesSection />}
                    {activeSection === "notifications" && <NotificationsSection />}
                    {activeSection === "accessibility" && <AccessibilitySection />}
                    {activeSection === "privacy" && <PrivacySection />}
                </div>
            </div>
        </motion.div>
    );
}

function ProfileSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                </div>

                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" defaultValue="" className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" disabled className="mt-1 bg-muted" />
                        <p className="text-caption text-muted-foreground mt-1">Contact support to change your email</p>
                    </div>
                </div>

                <Button className="mt-4">Save Changes</Button>
            </CardContent>
        </Card>
    );
}

function PreferencesSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize how SpurTalk works for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Use fuzzy deadline labels</p>
                        <p className="text-body-small text-muted-foreground">
                            Show &quot;Soon&quot; or &quot;This Week&quot; instead of specific dates
                        </p>
                    </div>
                    <Checkbox defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Anti-Perfectionism Mode</p>
                        <p className="text-body-small text-muted-foreground">
                            Extra encouragement to &quot;just start&quot; and celebrate small wins
                        </p>
                    </div>
                    <Checkbox defaultChecked />
                </div>

                <Separator />

                <div>
                    <p className="font-medium text-foreground mb-2">Stall detection timeout</p>
                    <p className="text-body-small text-muted-foreground mb-3">
                        Get gentle help if a task stays inactive for this long
                    </p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">24 hours</Badge>
                        <span className="text-caption text-muted-foreground">(default)</span>
                    </div>
                </div>

                <Button className="mt-4">Save Preferences</Button>
            </CardContent>
        </Card>
    );
}

function NotificationsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reminders</CardTitle>
                <CardDescription>How and when we nudge you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="font-medium text-foreground mb-2">Reminder tone</p>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="cursor-pointer">Encouraging</Badge>
                        <Badge variant="outline" className="cursor-pointer">Neutral</Badge>
                        <Badge variant="outline" className="cursor-pointer">Humorous</Badge>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Daily check-in</p>
                        <p className="text-body-small text-muted-foreground">
                            A gentle morning reminder to pick your focus
                        </p>
                    </div>
                    <Checkbox defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Streak notifications</p>
                        <p className="text-body-small text-muted-foreground">
                            Celebrate when you maintain your streak
                        </p>
                    </div>
                    <Checkbox defaultChecked />
                </div>

                <Button className="mt-4">Save Preferences</Button>
            </CardContent>
        </Card>
    );
}

function AccessibilitySection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Make SpurTalk work best for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">High contrast mode</p>
                        <p className="text-body-small text-muted-foreground">
                            Increase color contrast for better visibility
                        </p>
                    </div>
                    <Checkbox />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Reduce motion</p>
                        <p className="text-body-small text-muted-foreground">
                            Minimize animations throughout the app
                        </p>
                    </div>
                    <Checkbox />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Enhanced screen reader</p>
                        <p className="text-body-small text-muted-foreground">
                            Additional context for assistive technologies
                        </p>
                    </div>
                    <Checkbox />
                </div>

                <Button className="mt-4">Save Settings</Button>
            </CardContent>
        </Card>
    );
}

function PrivacySection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>Your data belongs to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="font-medium text-foreground mb-2">Export your data</p>
                    <p className="text-body-small text-muted-foreground mb-3">
                        Download all your tasks, garden progress, and settings
                    </p>
                    <Button variant="outline">Export Data</Button>
                </div>

                <Separator />

                <div>
                    <p className="font-medium text-foreground mb-2">Delete account</p>
                    <p className="text-body-small text-muted-foreground mb-3">
                        Permanently remove your account and all data
                    </p>
                    <Button variant="outline" className="text-sand-600 border-sand-600 hover:bg-sand-50">
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
