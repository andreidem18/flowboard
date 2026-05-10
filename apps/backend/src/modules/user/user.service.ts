import { GetAllUsersQuery } from "@repo/shared";
import { userRepository } from "./user.repository";

export const userService = {
  async getAllUsers(filters: GetAllUsersQuery) {
    return userRepository.getAllUsers(filters);
  },
};
