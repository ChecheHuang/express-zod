import { authMiddleware } from '@/middleware/authMiddleware'
import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

export const procedure = defaultEndpointsFactory.build.bind(defaultEndpointsFactory)

export const privateProcedure = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build.bind(defaultEndpointsFactory.addMiddleware(authMiddleware))

const aaa = defaultEndpointsFactory.build({
  tag: '123',
  method: 'get',
  input: z.object({name:z.string()}),
  output: z.object({}),
  handler: async ({ input, options, logger }) => {
    return {}
  },
})



// const aaa2 = fn
// .method('get')
// .tag('123')
// .input(z.object({}))
// .output(z.object({}))
// .handler(async ({ input, options, logger }) => {
//   return {}
// }