import { ShoppingBag } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginFormHeader = () => {
  return (
    <CardHeader className="space-y-2 text-center pt-6 pb-1">
      <div className="mx-auto relative">
        <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-brand to-[#818CF8] rounded-2xl p-3 w-12 h-12 flex items-center justify-center shadow-lg shadow-brand/25">
          <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.2} />
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <CardTitle className="text-xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </CardDescription>
      </div>
    </CardHeader>
  );
};
