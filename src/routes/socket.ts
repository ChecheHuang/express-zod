import { z } from 'zod'
import { ActionsFactory, createSimpleConfig } from 'zod-sockets'

export const socketConfig = createSimpleConfig({
  //todo 定義可以發送讓客戶端監聽的事件
  emission: {
    onChat: {
      schema: z.tuple([z.string(), z.object({ from: z.string() })]),
    },
  },
  examples: {
    onChat: { payload: ['Hello there!', { from: '123abc' }] },
  },
  hooks: {
    onConnection: async ({ client, withRooms, all }) => {
      // console.log(client)
      // console.log('onConnection')
    },
  },
  metadata: z.object({
    // Number of messages sent using the chat event
    msgCount: z.number().int(),
  }),
})
export const actionsFactory = new ActionsFactory(socketConfig)

export const socketProcedure = actionsFactory.build.bind(actionsFactory)

const subscribersRoom = 'subscribers'

export const actions = [
  socketProcedure({
    event: 'ping',
    //curl "http://localhost:8081/socket.io/?EIO=4&transport=polling"
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
