import { Middleware } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

export const authMiddleware = new Middleware({
  security: {
    and: [{ type: 'header', name: 'token' }],
  },
  input: z.object({
    key: z.string().optional(),
  }),
  handler: async ({ input, request, logger }) => {
    logger.debug('Checking the key and token')
    console.log(request.headers.token)
    const user = {
      token: '123',
    }
    if (request.headers.token !== user.token) {
      throw createHttpError(401, 'Invalid token')
    }
    return { user }
  },
})
