import { verifyToken } from '@/middleware/express/tokenMiddleware'
import { Middleware } from 'express-zod-api'
import createHttpError from 'http-errors'

import { z } from 'zod'

export const authMiddleware = new Middleware({
  security: {
    and: [{ type: 'header', name: 'authorization' }],
  },
  input: z.object({}),
  handler: async ({ request }) => {
    const token = request.headers['authorization']?.split(' ')[1]
    if (!token) throw createHttpError(401, '請先登入')
    try {
      const user = await verifyToken(token)
      return { user }
    } catch (error) {
      throw createHttpError(401, error as string)
    }
  },
})
