import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsService } from '@/services/factories/make-fetch-user-check-ins-history'

export async function userHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInsHistoryQuerySchema.parse(request.query)

  const fetchCheckInsUserHistory = makeFetchUserCheckInsService()

  const { checkIns } = await fetchCheckInsUserHistory.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(201).send({ checkIns })
}
