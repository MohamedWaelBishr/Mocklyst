import { Suspense } from "react"
import { EmailVerificationPage } from "@/components/auth/EmailVerificationPage"
import { AnimatedLoader } from "@/components/ui/animated-loader"

export default function VerifyPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <EmailVerificationPage />
    </Suspense>
  )
}
