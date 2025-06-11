import { Suspense } from "react"
import { SignInForm } from "@/components/auth/SignInForm"
import { AnimatedLoader } from "@/components/ui/animated-loader"

export default function SignInPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <SignInForm />
    </Suspense>
  )
}
