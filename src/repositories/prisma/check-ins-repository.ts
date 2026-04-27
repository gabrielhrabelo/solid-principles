import type { Prisma } from "../../../generated/prisma/browser";
import type { Checkin } from "../../../generated/prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
}