import { authMiddleware } from '@/middleware/authMiddleware'
import { defaultEndpointsFactory, Routing } from 'express-zod-api'
import { auth } from './auth'
import todo from './todo'
export const procedure = defaultEndpointsFactory.build.bind(defaultEndpointsFactory)

export const privateProcedure = defaultEndpointsFactory.addMiddleware(authMiddleware).build.bind(defaultEndpointsFactory)

export const routing: Routing = {
  api: {
    auth,
    todo,
  },
}
