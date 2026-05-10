import { GetAllUsersQuery, User } from "@repo/shared";
import { userRepository } from "./user.repository";
import { serializeUser } from "./user.serializers";

export const userService = {
  async getAllUsers(filters: GetAllUsersQuery): Promise<User[]> {
    const users = await userRepository.getAllUsers(filters);
    return users.map(serializeUser);
  },
};
