import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { signUpSchema, type SignUpFormData } from "../schemas/auth.schema"
import { useSignupMutation } from "../mutation"
import { toast } from "sonner"
import { checkAuthError } from "../helpers"

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })
  const { mutateAsync: signupMutation } = useSignupMutation()

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signupMutation(data)
      toast.success("Account created successfully")
    } catch (error) {
      if (checkAuthError(error, "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")) {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        })
        return
      }
      throw new Error("Error creating user")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Your name"
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  )
}
