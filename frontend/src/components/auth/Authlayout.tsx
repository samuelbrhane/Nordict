"use client";

import { ReactNode } from "react";
import { AuthHeader, AuthFooter } from ".";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-[0.07] dark:opacity-[0.12]"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      <AuthHeader />

      {/* Main content - centered */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-24">
        {children}
      </main>

      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
