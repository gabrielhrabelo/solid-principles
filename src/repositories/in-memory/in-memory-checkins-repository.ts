import { randomUUID } from "node:crypto"
import type { Checkin } from "../../../generated/prisma/client"
import type { CheckinUncheckedCreateInput} from "../../../generated/prisma/models"
import type { CheckInsRepository } from "../prisma/check-ins-repository"

export class InMemoryCheckinsRepository implements CheckInsRepository {

  public items: Checkin[] = []

  async create(data: CheckinUncheckedCreateInput) {
    const checkIn =  {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at): null,
      created_at: new Date()
    }

    this.items.push(checkIn)

    return checkIn

  }

}