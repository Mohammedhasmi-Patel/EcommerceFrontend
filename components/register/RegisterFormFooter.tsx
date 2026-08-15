import { CardFooter } from "@/components/ui/card";
import Link from "next/link";

export const RegisterFormFooter = () => {
  return (
    <CardFooter className="justify-center py-3 pr-4 bg-muted/30">
      <p className="text-sm text-muted-foreground">
        Already have an account?
        <Link
          href="/login"
          className="font-semibold ml-1 text-brand hover:text-brand-hover transition-colors duration-200 hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </CardFooter>
  );
};
