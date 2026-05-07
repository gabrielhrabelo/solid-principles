import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics'

export async function userMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserMetricsService = makeGetUserMetricsService()

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
