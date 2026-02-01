"use client";

import { motion } from "framer-motion";
import { Sparkles, CreditCard, Check, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FREE_FEATURES = [
    "Core task management",
    "River Timeline view",
    "Basic Garden visualization",
    "2-minute focus timer",
    "3 AI decompositions/month",
];

const PREMIUM_FEATURES = [
    "Everything in Free",
    "Advanced AI Unblocker",
    "Unlimited document parsing",
    "Detailed Garden analytics",
    "Custom themes",
    "Priority support",
];

const COMPARISON = [
    { feature: "AI Nano-steps", free: "3/month", premium: "Unlimited" },
    { feature: "Document Uploads", free: "3/month", premium: "Unlimited" },
    { feature: "Task History", free: "30 days", premium: "Forever" },
    { feature: "Garden Elements", free: "Basic", premium: "Premium variants" },
];

export default function PricingPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto max-w-4xl px-4 py-8"
        >
            {/* Header */}
            <header className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Simple Pricing
                </Badge>
                <h1 className="text-h1 text-foreground mb-2">
                    Focus on what matters
                </h1>
                <p className="text-body text-muted-foreground max-w-lg mx-auto">
                    Simple plans to support your journey. No hidden fees, cancel anytime.
                </p>
            </header>

            {/* Pricing Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {/* Free Tier */}
                <Card className="relative">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            Free
                        </CardTitle>
                        <CardDescription>Get started with the basics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <span className="text-h1 text-foreground">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {FREE_FEATURES.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-body-small">
                                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button variant="outline" className="w-full" disabled>
                            Current Plan
                        </Button>
                    </CardContent>
                </Card>

                {/* Premium Tier */}
                <Card className="relative border-primary/50 shadow-lg">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                            <Zap className="h-3 w-3 mr-1" />
                            Most Popular
                        </Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Premium
                        </CardTitle>
                        <CardDescription>Unlock your full potential</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <span className="text-h1 text-foreground">$9</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {PREMIUM_FEATURES.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-body-small">
                                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button className="w-full">
                            Upgrade to Premium
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Compare Plans</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Header Row */}
                        <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                            <span className="text-body-small font-medium text-foreground">Feature</span>
                            <span className="text-body-small font-medium text-foreground text-center">Free</span>
                            <span className="text-body-small font-medium text-foreground text-center">Premium</span>
                        </div>

                        {/* Data Rows */}
                        {COMPARISON.map((row) => (
                            <div key={row.feature} className="grid grid-cols-3 gap-4 py-2">
                                <span className="text-body-small text-foreground">{row.feature}</span>
                                <span className="text-body-small text-muted-foreground text-center">{row.free}</span>
                                <span className="text-body-small text-primary font-medium text-center">{row.premium}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-center text-caption text-muted-foreground mt-8">
                Questions? We&apos;re here to help. No pressure, ever.
            </p>
        </motion.div>
    );
}
