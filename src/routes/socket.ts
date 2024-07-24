import { socketProcedure } from '@/utils/procedure'
import { z } from 'zod'

//todo 定義可以發送讓客戶端監聽的事件
export const emission = {
  onChat: {
    schema: z.tuple([z.string()]),
  },
}

export const actions = [
  socketProcedure({
    event: 'ping',
    //curl "http://localhost:8081/socket.io/?EIO=4&transport=polling"
    input: z.tuple([]).rest(z.unknown()),
    output: z.tuple([z.literal('pong')]).rest(z.unknown()),
    handler: async ({ input }) => ['pong' as const, ...input],
  }),
  socketProcedure({
    event: 'chat',
    input: z.tuple([z.string()]),
    handler: async ({ input: [message], client, all, withRooms, logger }) => {
      await client.broadcast('onChat', message)
      await client.emit('onChat', message)
    },
  }),
]
