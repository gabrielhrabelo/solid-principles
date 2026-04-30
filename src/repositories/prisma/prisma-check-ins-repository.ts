import { prisma } from '@/lib/prisma'
import type { Checkin } from '../../../generated/prisma/client'
import type { CheckinUncheckedCreateInput } from '../../../generated/prisma/models'
import type { CheckInsRepository } from './check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    })

    return checkIn
  }
  async save(data: Checkin) {
    const checkIn = await prisma.checkin.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }
  async findById(id: string) {
    const checkIn = await prisma.checkin.findUnique({
      where: { id },
    })

    return checkIn
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).startOf('date')

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
    return checkIn
  }
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }
  async countByUserId(userId: string) {
    const count = await prisma.checkin.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }
}
