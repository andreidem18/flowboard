import { describe, it, expect, beforeEach, vi } from "vitest";
import { userRepository } from "@/modules/user/user.repository";
import { prisma } from "@/lib/prisma";
import type { User as PrismaUser } from "generated/prisma/client";
import { mockPrismaUser, mockPrismaUsers } from "./mockData";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

describe("UserRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users when no filters are provided", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue(
        mockPrismaUsers as PrismaUser[],
      );

      const result = await userRepository.getAllUsers({});

      expect(result).toEqual(mockPrismaUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({ where: {} });
    });

    it("should filter by name (case insensitive) when name filter is provided", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([
        mockPrismaUser,
      ] as PrismaUser[]);

      const result = await userRepository.getAllUsers({ name: "alice" });

      expect(result).toEqual([mockPrismaUser]);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { name: { contains: "alice", mode: "insensitive" } },
      });
    });

    it("should return an empty array when no users match the filter", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);

      const result = await userRepository.getAllUsers({ name: "nonexistent" });

      expect(result).toEqual([]);
      expect(prisma.user.findMany).toHaveBeenCalledOnce();
    });

    it("should not apply name filter when name is undefined", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue(
        mockPrismaUsers as PrismaUser[],
      );

      await userRepository.getAllUsers({ name: undefined });

      expect(prisma.user.findMany).toHaveBeenCalledWith({ where: {} });
    });
  });
});
