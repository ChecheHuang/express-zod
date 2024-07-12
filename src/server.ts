import { PORT, SERVER_ADDRESS } from '@/config'
import { logMiddleware } from '@/middleware/express/logMiddleware'
import { routing } from '@/routes'
import chalk from 'chalk'
import { createConfig, createServer, Documentation } from 'express-zod-api'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocument = YAML.load('src/swagger.yaml')

export const config = createConfig({
  server: {
    listen: PORT,
    beforeRouting: ({ app, logger }) => {
      app.use(logMiddleware)
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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

async function createYaml(path: string) {
  const yamlString = new Documentation({
    routing, // the same routing and config that you use to start the server
    config,
    version: '1.2.3',
    title: 'Example API',
    serverUrl: SERVER_ADDRESS,
    composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
    // descriptions: { positiveResponse, negativeResponse, requestParameter, requestBody } // check out these features
  }).getSpecAsYaml()
  fs.writeFile(path, yamlString, (err) => {})
}
async function startServer() {
  await createYaml('src/swagger.yaml')
  createServer(config, routing)
  console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}`))
  console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}/api-docs`))
}
startServer()
