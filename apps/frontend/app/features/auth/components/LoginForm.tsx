import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { loginSchema, type LoginFormData } from "../schemas/auth.schema"
import { useLoginMutation } from "../mutation"
import { toast } from "sonner"
import { checkAuthError } from "../helpers"

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const { mutateAsync: loginMutation } = useLoginMutation()

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implementar llamada API de login
      await loginMutation(data)
      toast.success("Login exitoso")
    } catch (error) {
      if (checkAuthError(error, "INVALID_EMAIL_OR_PASSWORD")) {
        setError("form", {
          type: "manual",
          message: "Invalid credentials",
        })
        return
      }
      throw new Error("Error logging in")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {errors.form && (
        <p className="text-sm text-red-500">{errors.form.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
