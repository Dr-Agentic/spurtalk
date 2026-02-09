"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Layers,
  Calendar,
  Flower,
  FileText,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Deck", href: "/deck", icon: Layers },
  { label: "Timeline", href: "/timeline", icon: Calendar },
  { label: "Garden", href: "/garden", icon: Flower },
  { label: "Documents", href: "/documents", icon: FileText },
];

interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (email?: string, name?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 h-16 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "shadow-subtle",
        className
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
          aria-label="SpurTalk Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            SpurTalk
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "gap-2 transition-colors",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={(user as { avatar?: string })?.avatar || undefined}
                  alt={user?.email || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user?.email, (user as { name?: string })?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {(user as { name?: string })?.name || "Welcome!"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "Not signed in"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-warning focus:text-warning"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Navigation menu">
                <Layers className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </motion.header>
  );
}
