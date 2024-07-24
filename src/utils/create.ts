import { routing } from '@/routes'
import { config } from '@/server'
import { Documentation, Integration } from 'express-zod-api'
import fs from 'fs'
import { SERVER_ADDRESS } from '../config'

export const swaggerDocumentPath = 'src/swagger.yaml'
export const clientDocumentPath = 'client/src/lib/implementation.ts'
// export const clientDocumentPath = 'src/generated/implementation.ts'
export async function createYaml(path: string) {
  const yamlString = new Documentation({
    routing: routing, // the same routing and config that you use to start the server
    config: config,
    version: '1.2.3',
    title: 'Example API',
    serverUrl: SERVER_ADDRESS,
    composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
    // descriptions: { positiveResponse, negativeResponse, requestParameter, requestBody } // check out these features
  }).getSpecAsYaml()
  fs.writeFileSync(path, yamlString)
}

export async function createClient(filePath = clientDocumentPath) {
  const client = new Integration({
    routing: routing,
    variant: 'client', // <— optional, see also "types" for a DIY solution
    optionalPropStyle: { withQuestionMark: true, withUndefined: true }, // optional
    splitResponse: false, // optional, prints the positive and negative response types separately
  })
  const prettierFormattedTypescriptCode = await client.printFormatted() // or just .print() for unformatted
  const file =
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

  const fold = filePath.split('/').slice(0, -1).join('/')
  console.log(fold)
  if (!fs.existsSync(fold)) {
    await fs.mkdirSync(fold, { recursive: true })
  }
  fs.writeFileSync(filePath, file)
}
