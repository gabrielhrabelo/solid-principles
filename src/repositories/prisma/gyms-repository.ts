import type { Prisma } from "../../../generated/prisma/browser";
import type { Gym } from "../../../generated/prisma/client";

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}