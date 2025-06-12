import { Suspense } from "react"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { AnimatedLoader } from "@/components/ui/animated-loader"

export default function SignUpPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <SignUpForm />
    </Suspense>
  )
}
