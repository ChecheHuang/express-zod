import { PORT, SERVER_ADDRESS } from '@/config'
import { logMiddleware } from '@/middleware/express/logMiddleware'
import { routing } from '@/routes'
import { createYaml, swaggerDocumentPath } from '@/utils/create'
import chalk from 'chalk'
import { createConfig, createServer } from 'express-zod-api'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

export const config = createConfig({
  server: {
    listen: PORT,
    beforeRouting: ({ app, logger }) => {
      app.use(logMiddleware)
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(swaggerDocumentPath)))
    },
  },
  cors: false,
  logger: { level: 'debug', color: true },

  // tags: {
  //   users: 'Everything about the users',
  //   files: {
  //     description: 'Everything about the files processing',
  //     url: 'https://example.com',
  //   },
  // },
})

async function startServer() {
  createServer(config, routing)
  console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}`))
  console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}/api-docs`))
}
createYaml(swaggerDocumentPath)
// createClient()
startServer()
