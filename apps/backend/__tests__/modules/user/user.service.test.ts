import { describe, it, expect, beforeEach, vi } from "vitest";
import { userService } from "@/modules/user/user.service";
import { userRepository } from "@/modules/user/user.repository";
import {
  mockPrismaUser,
  mockPrismaUsers,
  mockUser,
  mockUsers,
} from "./mockData";

vi.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    getAllUsers: vi.fn(),
  },
}));

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return serialized users when no filter is provided", async () => {
      vi.mocked(userRepository.getAllUsers).mockResolvedValue(mockPrismaUsers);

      const result = await userService.getAllUsers({});

      expect(result).toEqual(mockUsers);
      expect(userRepository.getAllUsers).toHaveBeenCalledWith({});
    });

    it("should pass the name filter to the repository", async () => {
      vi.mocked(userRepository.getAllUsers).mockResolvedValue([mockPrismaUser]);

      const result = await userService.getAllUsers({ name: "alice" });

      expect(result).toEqual([mockUser]);
      expect(userRepository.getAllUsers).toHaveBeenCalledWith({
        name: "alice",
      });
    });

    it("should serialize dates to ISO strings", async () => {
      vi.mocked(userRepository.getAllUsers).mockResolvedValue([mockPrismaUser]);

      const result = await userService.getAllUsers({});

      expect(typeof result[0]?.createdAt).toBe("string");
      expect(typeof result[0]?.updatedAt).toBe("string");
    });

    it("should return an empty array when repository returns no users", async () => {
      vi.mocked(userRepository.getAllUsers).mockResolvedValue([]);

      const result = await userService.getAllUsers({ name: "nonexistent" });

      expect(result).toEqual([]);
    });
  });
});
