import { redirect } from "next/navigation"

export default function LoginPage() {
  redirect("/sign-in")
}

export const metadata = {
  title: "Login | Daily Event Insurance",
  description: "Sign in to your partner account",
}
