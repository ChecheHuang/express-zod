import { authMiddleware } from '@/middleware/authMiddleware'
import { defaultEndpointsFactory } from 'express-zod-api'

export const procedure = defaultEndpointsFactory.build.bind(defaultEndpointsFactory)

export const privateProcedure = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build.bind(defaultEndpointsFactory.addMiddleware(authMiddleware))
