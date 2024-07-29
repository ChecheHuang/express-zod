import { PORT, SERVER_ADDRESS } from '@/config'
import { logMiddleware } from '@/middleware/express/logMiddleware'
import { routing } from '@/routes'
import { actions, socketConfig } from '@/routes/socket'
import { createApiProvide, createSocketProvide, createSocketYaml, createSwaggerYaml, swaggerYamlPath } from '@/utils/create'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { attachRouting, createConfig } from 'express-zod-api'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { attachSockets } from 'zod-sockets'

export const publicPath = path.join(path.resolve(__dirname, '..'), '/public')
const app = express()
const server = http.createServer(app)

export const config = createConfig({
  app,
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
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())

  app.use(logMiddleware)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(swaggerYamlPath)))
  const { notFoundHandler, logger } = attachRouting(config, routing)
  await attachSockets({
    io,
    config: socketConfig,
    actions,
    target: server,
  })

  app.use(express.static(publicPath))
  app.get('/*', function (req, res) {
    res.sendFile(path.join(publicPath, 'index.html'))
  })
  app.use(notFoundHandler)

  server.listen(PORT, () => {
    console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}`))
    console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}/api-docs`))
  })
}

;(async () => {
  await createSwaggerYaml()
  await createApiProvide('client/src/lib/implementation.ts')
  await createSocketYaml()
  await createSocketProvide('client/src/lib/socket-implementation.ts')
  await startServer()
})()
