import { SelectItem } from "~/components/ui/select";
import type { Control, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";
import { FormSelect } from "./FormSelect";
import { UserAvatar } from "../UserAvatar";
import { useGetAllUsers } from "~/features/users/queries";

interface UserSelectorProps {
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function UserSelector({
  control,
  errors,
  isSubmitting,
}: UserSelectorProps) {
  const { data: allUsers } = useGetAllUsers();

  if (!allUsers) {
    return null;
  }

  return (
    <FormSelect
      name="userId"
      label="User"
      control={control}
      errors={errors}
      disabled={isSubmitting}
    >
      {allUsers?.map((user) => (
        <SelectItem key={user.id} value={user.id}>
          <UserAvatar userName={user.name} />
          {user.name}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
