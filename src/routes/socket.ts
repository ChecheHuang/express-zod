import { z } from 'zod'
import { ActionsFactory, createSimpleConfig } from 'zod-sockets'
const subscribersRoom = 'subscribers'
export const socketConfig = createSimpleConfig({
  //todo 定義可以發送讓客戶端監聽的事件
  emission: {
    onChat: {
      schema: z.tuple([z.string(), z.object({ from: z.string() })]),
    },
    time: {
      schema: z.tuple([
        z
          .date()
          .transform((date) => date.toISOString())
          .describe('current ISO time'),
      ]),
    },
    rooms: {
      schema: z.tuple([z.string().array().describe('room IDs')]),
    },
  },
  examples: {
    onChat: { payload: ['Hello there!', { from: '123abc' }] },
    time: { payload: ['2024-03-28T21:13:15.084Z'] },
    rooms: [{ payload: [['room1', 'room2']] }, { payload: [['room3', 'room4', 'room5']] }],
  },
  hooks: {
    onConnection: async ({ client }) => {
      await client.broadcast('onChat', `${client.id} entered the chat`, {
        from: client.id,
      })
    },
    onStartup: async ({ all, withRooms }) => {
      setInterval(() => {
        all.broadcast('rooms', all.getRooms()) // <— payload type constraints
      }, 30000)
      setInterval(() => {
        withRooms('subscribers').broadcast('time', new Date()) // <— payload type constraints
      }, 1000)
    },
  },
  metadata: z.object({
    // Number of messages sent using the chat event
    msgCount: z.number().int(),
  }),
})
export const actionsFactory = new ActionsFactory(socketConfig)

export const socketProcedure = actionsFactory.build.bind(actionsFactory)

export const actions = [
  socketProcedure({
    event: 'ping',
    //curl "http://localhost:8080/socket.io/?EIO=4&transport=polling"
    input: z.tuple([]).rest(z.unknown()),
    output: z.tuple([z.literal('pong')]).rest(z.unknown()),
    handler: async ({ input }) => ['pong' as const, ...input],
  }),
  socketProcedure({
    event: 'subscribe',
    input: z.tuple([]).rest(z.unknown().describe('Does not matter')),
    handler: async ({ logger, client }) => {
      logger.info(`Subscribed ${client.id}`)
      await client.join(subscribersRoom)
    },
  }),
  socketProcedure({
    event: 'unsubscribe',
    input: z.tuple([]).rest(z.unknown().describe('Does not matter')),
    handler: async ({ logger, client }) => {
      logger.info(`Unsubscribed ${client.id}`)
      await client.leave(subscribersRoom)
    },
  }),
  socketProcedure({
    event: 'chat',
    input: z.tuple([z.string().describe('message')]),
    handler: async ({ input: [message], client, all, withRooms, logger }) => {
      try {
        await all.broadcast('onChat', message, { from: client.id })
        client.setData({
          msgCount: (client.getData().msgCount || 0) + 1,
        })
      } catch (error) {
        logger.error('Failed to broadcast', error)
      }
    },
  }).example('input', ['Hello there']),
]
