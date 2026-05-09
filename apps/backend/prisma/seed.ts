import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "better-auth/crypto";
import { env } from "../src/lib/env";
import { USER_FIXTURES, PROJECT_FIXTURES, TASK_FIXTURES } from "./fixtures";

const connectionString = env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Users
  for (const user of USER_FIXTURES) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`✓ ${USER_FIXTURES.length} users seeded`);

  // Account for Alice (dev login user) — requires SEED_USER_PASSWORD in .env
  const seedPassword = env.SEED_USER_PASSWORD;
  const alice = USER_FIXTURES[0];
  const hashed = await hashPassword(seedPassword);
  const accountId = `seed-account-${alice.id}`;
  await prisma.account.upsert({
    where: { id: accountId },
    update: { password: hashed },
    create: {
      id: accountId,
      accountId: alice.id,
      providerId: "credential",
      userId: alice.id,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`✓ Account created for ${alice.email} (login enabled)`);

  // Projects
  for (const project of PROJECT_FIXTURES) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    });
  }
  console.log(`✓ ${PROJECT_FIXTURES.length} projects seeded`);

  // Tasks
  for (const task of TASK_FIXTURES) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {},
      create: {
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : null,
        finishedAt: task.finishedAt ? new Date(task.finishedAt) : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      },
    });
  }
  console.log(`✓ ${TASK_FIXTURES.length} tasks seeded`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
