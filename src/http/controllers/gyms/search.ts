import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsService } from '@/services/factories/make-search-gyms'

export async function searchGym(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymQuerySchema.parse(request.query)

  const searchGymService = makeSearchGymsService()

  const { gyms } = await searchGymService.execute({
    query,
    page,
  })

  return reply.status(200).send({ gyms })
}
