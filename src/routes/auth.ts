import { createToken, TokenType, verifyToken } from '@/middleware/express/tokenMiddleware'
import prismadb from '@/utils/prismadb'
import { procedure } from '@/utils/procedure'
import bcrypt from 'bcrypt'
import { defaultEndpointsFactory, Routing } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJhY2NvdW50IjoiYWNjb3VudCIsImlhdCI6MTcyMTA5OTk0MiwiZXhwIjoxNzIxNzA0NzQyfQ.hw81Nkq2R0yS3iHdOeo1KVwJV9JqZdilY1VIo3hlDpo'

const tags = ['身分驗證']
const tokenSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .example({
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJhY2NvdW50IjoiYWNjb3VudCIsImlhdCI6MTcyMTA5OTk0MiwiZXhwIjoxNzIxMTg2MzQyfQ.c2eBcyYfPLkLw-YCmFX1B0lArKaJIom222J8Nnffx8s',
    refreshToken,
  })
export const auth: Routing = {
  login: procedure({
    tags,
    method: 'post',
    input: z
      .object({
        account: z.string(),
        password: z.string(),
      })
      .example({
        account: 'account',
        password: 'password',
      }),
    output: tokenSchema,
    handler: async ({ input }) => {
      const { account, password } = input
      const user = await prismadb.user.findFirst({
        select: {
          id: true,
          account: true,
          password: true,
        },
        where: {
          account,
        },
      })
      if (!user) throw createHttpError(401, '沒有這個帳號')
      const { password: dbPassword } = user
      const result = await bcrypt.compare(password, dbPassword)
      if (!result) throw createHttpError(401, '密碼錯誤')
      const token = createToken({
        id: user.id.toString(),
        account,
      })
      return token
    },
  }),
  refresh: defaultEndpointsFactory.build({
    tags,
    method: 'post',
    input: z.object({ refreshToken: z.string() }).example({
      refreshToken,
    }),
    output: tokenSchema,
    handler: async ({ input: { refreshToken } }) => {
      try {
        const decoded = await verifyToken(refreshToken)
        const jwt = createToken(decoded as TokenType)
        return jwt
      } catch (error) {
        throw createHttpError(401, '請重新登入')
      }
    },
  }),
}
