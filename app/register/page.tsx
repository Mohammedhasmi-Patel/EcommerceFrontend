import { RegisterForm } from "@/components/register/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | LuxeRetail",
  description: "Create a new LuxeRetail account to start shopping and tracking your orders.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand/15 rounded-full blur-[100px] animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#818CF8]/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C084FC]/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <RegisterForm />
      </div>
    </main>
  );
}
