import { CardFooter } from "@/components/ui/card";
import Link from "next/link";

export const LoginFormFooter = () => {
  return (
    <CardFooter className="justify-center py-3 bg-muted/30">
      <p className="text-sm text-muted-foreground">
        Dont have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand hover:text-brand-hover transition-colors duration-200 hover:underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </CardFooter>
  );
};
