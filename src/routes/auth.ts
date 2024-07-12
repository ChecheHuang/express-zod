import { procedure } from '@/utils/procedure'
import { defaultEndpointsFactory, Routing } from 'express-zod-api'
import { z } from 'zod'

const tag = '身分驗證'

export const auth: Routing = {
  login: procedure({
    tag,
    method: 'post',
    input: z.object({}),
    output: z.object({
      name: z.string().example('123'),
    }),
    handler: async ({ input, options, logger }) => {
      // input

      return { name: '123' }
    },
  }),
  refresh: defaultEndpointsFactory.build({
    tag,
    method: 'post',
    input: z.object({}),
    output: z.object({}),
    handler: async ({ input, options, logger }) => {
      // input
      return {}
    },
  }),
}
