import { defaultEndpointsFactory, DependsOnMethod, Routing } from 'express-zod-api'
import { z } from 'zod'

const tag = 'Todo'

const todo: Routing = {
  '': new DependsOnMethod({
    get: defaultEndpointsFactory.build({
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
      input: z.object({}),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
    put: defaultEndpointsFactory.build({
      tag,
      method: 'put',
      input: z.object({}),
      output: z.object({}),
      handler: async ({ input, options, logger }) => {
        return {}
      },
    }),
    delete: defaultEndpointsFactory.build({
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
