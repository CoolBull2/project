"use client";
import { cn } from "../../lib/utils";
import React from "react";

export const AuroraBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900",
        className
      )}
    >
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-[10rem] -left-[10rem] h-[40rem] w-[40rem] rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/30" />
          <div className="absolute -top-[5rem] left-[20rem] h-[30rem] w-[30rem] rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/30" />
          <div className="absolute top-[5rem] right-[20rem] h-[35rem] w-[35rem] rounded-full bg-pink-500/20 blur-3xl dark:bg-pink-500/30" />
        </div>
        {children}
      </div>
    </div>
  );
};