import { useForm } from "react-hook-form"
import { loginSchema, type LoginFormData } from "../schemas/auth.schema"
import { useLoginMutation } from "../mutations"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { checkAuthError } from "../helpers"
import { useNavigate } from "react-router"

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })
  const { mutateAsync: loginMutation } = useLoginMutation()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation(data)
      toast.success("Login exitoso")
      // TODO: change navigate
      navigate("/")
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

  return { register, handleSubmit, errors, isSubmitting, onSubmit, setValue }
}
