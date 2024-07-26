import { SERVER_ADDRESS } from '@/config'
import { routing } from '@/routes'
import { actions, socketConfig } from '@/routes/socket'
import { config } from '@/server'
import { Documentation as ApiDocumentation, Integration as ApiIntegration } from 'express-zod-api'
import fs from 'fs'
import { Documentation, Integration as SocketIntegration } from 'zod-sockets'
import manifest from '../../package.json'

export const swaggerYamlPath = 'src/generated/swagger.yaml'
export const socketYamlPath = 'src/generated/socket.yaml'
export const apiProvidePath = 'src/generated/implementation.ts'
export const socketProvidePath = 'src/generated/socket-implementation.ts'

const createFile = (filePath: string, content: string) => {
  const fold = filePath.split('/').slice(0, -1).join('/')
  if (!fs.existsSync(fold)) fs.mkdirSync(fold, { recursive: true })
  fs.writeFileSync(filePath, content)
}

export async function createSwaggerYaml(filePath = swaggerYamlPath) {
  const yamlString = new ApiDocumentation({
    routing: routing, // the same routing and config that you use to start the server
    config: config,
    version: '1.2.3',
    title: 'Example API',
    serverUrl: SERVER_ADDRESS,
    composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
    // descriptions: { positiveResponse, negativeResponse, requestParameter, requestBody } // check out these features
  }).getSpecAsYaml()
  createFile(filePath, yamlString)
}

export async function createApiProvide(filePath = apiProvidePath) {
  const client = new ApiIntegration({
    routing: routing,
    variant: 'client', // <— optional, see also "types" for a DIY solution
    optionalPropStyle: { withQuestionMark: true, withUndefined: true }, // optional
    splitResponse: false, // optional, prints the positive and negative response types separately
  })
  const prettierFormattedTypescriptCode = await client.printFormatted() // or just .print() for unformatted
  const provideString =
    `/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

` +
    prettierFormattedTypescriptCode
      .replace(`/*`, '')
      .replace(`const client = new ExpressZodAPIClient(exampleImplementation);`, '')
      .replace('client.provide("get", "/v1/user/retrieve", { id: "10" });', '')
      .replace('*/', '')
      .replace('https://example.com', `${SERVER_ADDRESS}`)
      .replace('exampleImplementation', 'implementation') +
    `export const provide = new ExpressZodAPIClient(implementation).provide`
  createFile(filePath, provideString)
}

export async function createSocketYaml(filePath = socketYamlPath) {
  const yamlString = new Documentation({
    version: manifest.version,
    title: 'Example APP',
    description: 'AsyncAPI documentation example',
    contact: manifest.author,
    license: { name: 'license' },
    servers: { example: { url: `${SERVER_ADDRESS}/socket.io` } },
    config: socketConfig,
    actions: actions,
  }).getSpecAsYaml()
  const fold = filePath.split('/').slice(0, -1).join('/')
  createFile(filePath, yamlString)
}

export async function createSocketProvide(filePath = socketProvidePath) {
  const provideString =
    `/* eslint-disable @typescript-eslint/no-namespace */
  ` + new SocketIntegration({ config: socketConfig, actions }).print()
  createFile(filePath, provideString)
}
