import { Suspense } from "react"
import { PasswordResetForm } from "@/components/auth/PasswordResetForm"
import { AnimatedLoader } from "@/components/ui/animated-loader"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <PasswordResetForm />
    </Suspense>
  )
}
