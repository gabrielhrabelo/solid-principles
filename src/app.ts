import { appRoutes } from './http/routes'
import z, { ZodError } from 'zod'
import { env } from './env'
import { fastifySwagger } from '@fastify/swagger'
import { fastifyCors } from '@fastify/cors'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'

export const app = fastify()

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Wellhub app',
      description: 'API for an app like Wellhub',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server',
      },
    ],
  },
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(appRoutes)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // credential: true
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: z.treeifyError(error),
    })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like Datadog / NewRelic / Sentry
  }
  return reply.status(500).send({ message: 'internal server error' })
})

await app.ready()
app.swagger()
