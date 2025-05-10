import { PrismaClient } from "../generated/prisma";
export const prisma = new PrismaClient();

export function findUser(userId: bigint) {
  return prisma.user.findFirst({ where: { id: userId } });
}

export function fetchPost(userId: bigint, token: string) {
  return prisma.post.findFirst({ where: { userId, token } });
}

export function upsertPost(userId: bigint, token: string) {
  return prisma.post.upsert({
    where: {
      token_userId: {
        token,
        userId,
      },
    },
    update: { userId, token },
    create: { token, userId },
  });
}
