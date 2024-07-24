import { PORT, SERVER_ADDRESS } from '@/config'
import { logMiddleware } from '@/middleware/express/logMiddleware'
import { routing } from '@/routes'
import { actions, socketConfig } from '@/routes/socket'
import { createApiProvide, createSocketProvide, createSocketYaml, createSwaggerYaml, swaggerYamlPath } from '@/utils/create'
import chalk from 'chalk'
import { createConfig, createServer } from 'express-zod-api'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { attachSockets } from 'zod-sockets'
export const config = createConfig({
  server: {
    listen: PORT,
    beforeRouting: ({ app, logger }) => {
      app.use(logMiddleware)
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(swaggerYamlPath)))
    },
  },
  cors: true,
  logger: { level: 'debug', color: true },

  // tags: {
  //   users: 'Everything about the users',
  //   files: {
  //     description: 'Everything about the files processing',
  //     url: 'https://example.com',
  //   },
  // },
})
// shorthand for root namespace only
export const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
async function startServer() {
  const { httpServer, httpsServer } = await createServer(config, routing)
  await attachSockets({
    io,
    config: socketConfig,
    actions,
    target: httpsServer || httpServer,
  })
  console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}`))
  console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}/api-docs`))
}

;(async () => {
  await createSwaggerYaml()
  await createApiProvide('client/src/lib/implementation.ts')
  await createSocketYaml()
  await createSocketProvide('client/src/lib/socket-implementation.ts')
  await startServer()
})()
