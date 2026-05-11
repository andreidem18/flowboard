import type { User } from "@repo/shared";
import type { User as PrismaUser } from "generated/prisma/client";
import { USER_FIXTURES } from "../../../prisma/fixtures";

const now = new Date("2024-01-01T00:00:00.000Z");

export const mockPrismaUser: PrismaUser = {
  id: USER_FIXTURES[0].id,
  name: USER_FIXTURES[0].name,
  email: USER_FIXTURES[0].email,
  emailVerified: USER_FIXTURES[0].emailVerified,
  image: USER_FIXTURES[0].image,
  createdAt: now,
  updatedAt: now,
};

export const mockPrismaUser2: PrismaUser = {
  id: USER_FIXTURES[1].id,
  name: USER_FIXTURES[1].name,
  email: USER_FIXTURES[1].email,
  emailVerified: USER_FIXTURES[1].emailVerified,
  image: USER_FIXTURES[1].image,
  createdAt: now,
  updatedAt: now,
};

export const mockPrismaUsers: PrismaUser[] = USER_FIXTURES.map((u) => ({
  ...u,
  createdAt: now,
  updatedAt: now,
}));

export const mockUser: User = {
  id: USER_FIXTURES[0].id,
  name: USER_FIXTURES[0].name,
  email: USER_FIXTURES[0].email,
  emailVerified: USER_FIXTURES[0].emailVerified,
  image: USER_FIXTURES[0].image,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

export const mockUsers: User[] = USER_FIXTURES.map((u) => ({
  ...u,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
}));
