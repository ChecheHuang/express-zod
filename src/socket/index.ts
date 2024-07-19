import { socketProcedure } from '@/utils/procedure'
import { z } from 'zod'

//curl "http://localhost:8081/socket.io/?EIO=4&transport=polling"
const onPing = socketProcedure({
  event: 'ping',
  input: z.tuple([]).rest(z.unknown()),
  output: z.tuple([z.literal('pong')]).rest(z.unknown()),
  handler: async ({ input }) => ['pong' as const, ...input],
})
const onChat = socketProcedure({
  // ns: "/", // optional, root namespace is default
  event: 'chat',
  input: z.tuple([z.string()]),
  handler: async ({ input: [message], client, all, withRooms, logger }) => {
    console.log(client)

    /* your implementation here */
    // typeof message === "string"
  },
})

export const actions = [onPing, onChat]
