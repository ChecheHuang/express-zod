import { privateProcedure, procedure } from '@/utils/procedure'
import { defaultEndpointsFactory, DependsOnMethod, Routing } from 'express-zod-api'
import { z } from 'zod'

const tag = 'Todo'

const todo: Routing = {
  '': new DependsOnMethod({
    get: procedure({
      tag,
      method: 'get',
      input: z.object({}),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
    post: defaultEndpointsFactory.build({
      tag,
      method: 'post',
      input: z.object({}),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
  }),
  ':id': new DependsOnMethod({
    get: defaultEndpointsFactory.build({
      tag,
      method: 'get',
      input: z.object({
        id: z.string().transform((id) => parseInt(id, 10)),
      }),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        console.log(input.id)
        return {}
      },
    }),
    put: defaultEndpointsFactory.build({
      tag,
      method: 'put',
      input: z.object({
        id: z.string().transform((id) => parseInt(id, 10)),
      }),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
    delete: privateProcedure({
      tag,
      method: 'delete',
      input: z.object({}),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
  }),
}

export default todo
