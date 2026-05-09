import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { checkAuthError } from "../helpers"
import { useSignupMutation } from "../mutations"
import { type SignUpFormData, signUpSchema } from "../schemas/auth.schema"

export const useSignUpForm = () => {
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

  return { register, handleSubmit, errors, isSubmitting, onSubmit }
}
