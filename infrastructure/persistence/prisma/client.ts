import { PrismaClient } from "@/infrastructure/persistence/prisma/generated/client";

export const client = new PrismaClient();
