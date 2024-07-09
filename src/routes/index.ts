import { authMiddleware } from '@/middleware/auth'
import { defaultEndpointsFactory, Routing } from 'express-zod-api'
import { z } from 'zod'

export const procedure = defaultEndpointsFactory.build.bind(defaultEndpointsFactory)

export const privateProcedure = defaultEndpointsFactory.addMiddleware(authMiddleware).build.bind(defaultEndpointsFactory)

const helloWorldEndpoint = procedure({
  method: 'get', // or methods: ["get", "post", ...]
  input: z.object({
    // for empty input use z.object({})
    name: z.string().min(1),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    logger.info('Options:', options) // middlewares provide options
    return { greetings: `Hello, ${name || 'World'}. Happy coding!` }
  },
})

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
}
