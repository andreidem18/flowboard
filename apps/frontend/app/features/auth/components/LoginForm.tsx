import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Checkbox } from "~/components/ui/checkbox"
import { Wand2 } from "lucide-react"
import { useLoginForm } from "../hooks"

const MOCK_CREDENTIALS = {
  email: "alice@example.com",
  password: "admin1234",
}

export const LoginForm = () => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit, setValue } =
    useLoginForm()

  const fillMockCredentials = () => {
    setValue("email", MOCK_CREDENTIALS.email)
    setValue("password", MOCK_CREDENTIALS.password)
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          {...register("rememberMe")}
          disabled={isSubmitting}
        />
        <Label
          htmlFor="rememberMe"
          className="cursor-pointer text-sm font-normal"
        >
          Remember me
        </Label>
      </div>
      {errors.form && (
        <p className="text-sm text-red-500">{errors.form.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-xs text-muted-foreground hover:text-foreground"
        onClick={fillMockCredentials}
        disabled={isSubmitting}
      >
        <Wand2 className="mr-1 h-3 w-3" />
        Fill with demo credentials
      </Button>
    </form>
  )
}
