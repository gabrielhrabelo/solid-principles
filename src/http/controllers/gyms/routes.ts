import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createGym } from './create-gym'
import { fetchNeabyGyms } from './fetch-nearby'
import { searchGym } from './search'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', searchGym)
  app.get('/gyms/fetch-nearby', fetchNeabyGyms)

  app.post('/gyms', createGym)
}
