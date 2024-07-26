import prismadb from '@/utils/prismadb'
import { privateProcedure, procedure } from '@/utils/procedure'
import { todoSchema } from '@/zodSchemas'
import { defaultEndpointsFactory, DependsOnMethod, Routing } from 'express-zod-api'
import { z } from 'zod'

const tag = 'Todo'

const todo: Routing = {
  '': new DependsOnMethod({
    get: procedure({
      tag,
      method: 'get',
      input: z.object({}),
      output: z
        .object({
          todos: z.array(todoSchema),
        })
        .example({
          todos: [{ id: 1, title: 'string', content: 'string', status: true }],
        }),
      handler: async ({ input, options, logger }) => {
        const todos = await prismadb.todo.findMany()
        return { todos }
      },
    }),
    post: defaultEndpointsFactory.build({
      tag,
      method: 'post',
      input: todoSchema.omit({ id: true }).example({
        title: 'string',
        content: 'string',
        status: true,
      }),
      output: todoSchema.example({
        id: 1,
        title: 'string',
        content: 'string',
        status: true,
      }),
      handler: async ({ input, options, logger }) => {
        return await prismadb.todo.create({ data: input })
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
      output: todoSchema.example({
        id: 1,
        title: 'string',
        content: 'string',
        status: true,
      }),
      handler: async ({ input, options, logger }) => {
        console.log(input.id)
        const todo = await prismadb.todo.findUnique({
          where: { id: input.id },
        })
        if (!todo) throw new Error('找不到資料')
        return todo
      },
    }),
    put: defaultEndpointsFactory.build({
      tag,
      method: 'put',
      input: todoSchema.omit({ id: true }).extend({ id: z.string().transform((id) => parseInt(id, 10)) }),
      output: todoSchema.example({
        id: 1,
        title: 'string',
        content: 'string',
        status: true,
      }),
      handler: async ({ input: { id, ...data }, options, logger }) => {
        const exist = !!(await prismadb.todo.findUnique({
          where: { id },
        }))
        if (!exist) throw new Error('找不到資料')
        const todo = await prismadb.todo.update({
          where: { id: id },
          data,
        })
        return todo
      },
    }),
    delete: privateProcedure({
      tag,
      method: 'delete',
      input: z.object({
        id: z.string().transform((id) => parseInt(id, 10)),
      }),
      output: todoSchema.example({
        id: 1,
        title: 'string',
        content: 'string',
        status: true,
      }),
      handler: async ({ input: { id }, options, logger }) => {
        return await prismadb.todo.delete({
          where: { id },
        })
      },
    }),
  }),
}

export default todo
