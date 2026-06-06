"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-12 w-12 text-lg",
  md: "h-28 w-28 text-3xl",
  lg: "h-32 w-32 text-4xl",
};

export function ProfileAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const initial = name.charAt(0).toUpperCase() || "?";
  const dim = sizes[size];

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border-2 border-void-green bg-void-panel shadow-[0_0_30px_rgba(0,255,153,0.25)]",
        dim,
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-bold text-void-green">
          {size === "sm" ? (
            initial
          ) : (
            <User className={size === "lg" ? "h-14 w-14" : "h-12 w-12"} />
          )}
        </div>
      )}
    </div>
  );
}
