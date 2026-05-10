import { prisma } from "@/lib/prisma";
import { GetAllUsersQuery } from "@repo/shared";
import { UserWhereInput } from "generated/prisma/models";

export const userRepository = {
  async getAllUsers(filters: GetAllUsersQuery) {
    const where: UserWhereInput = {};
    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }
    return prisma.user.findMany({ where });
  },
};
