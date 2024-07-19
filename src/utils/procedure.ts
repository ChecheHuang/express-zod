import { authMiddleware } from '@/middleware/authMiddleware'
import { socketConfig } from '@/server'
import { defaultEndpointsFactory } from 'express-zod-api'
import { ActionsFactory } from 'zod-sockets'

export const procedure = defaultEndpointsFactory.build.bind(defaultEndpointsFactory)

export const privateProcedure = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build.bind(defaultEndpointsFactory.addMiddleware(authMiddleware))

export const actionsFactory = new ActionsFactory(socketConfig)

export const socketProcedure = actionsFactory.build.bind(actionsFactory)
