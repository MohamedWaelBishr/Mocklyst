import { Suspense } from "react"

import { AnimatedLoader } from "@/components/ui/animated-loader";
import { PasswordResetConfirmForm } from "@/components/auth/PasswordResetConfirmForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <PasswordResetConfirmForm />
    </Suspense>
  );
}