import { routing } from '@/routes'
import { config } from '@/server'
import { Documentation, Integration } from 'express-zod-api'
import fs from 'fs'
import { SERVER_ADDRESS } from '../config'

export const swaggerDocumentPath = 'src/generated/swagger.yaml'
export const clientDocumentPath = 'src/generated/swagger.yaml'
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
  fs.writeFile(path, yamlString, (err) => {})
}

export async function createClient(filePath = clientDocumentPath) {
  const client = new Integration({
    routing: routing,
    variant: 'client', // <— optional, see also "types" for a DIY solution
    optionalPropStyle: { withQuestionMark: true, withUndefined: true }, // optional
    splitResponse: false, // optional, prints the positive and negative response types separately
  })
  const prettierFormattedTypescriptCode = await client.printFormatted() // or just .print() for unformatted
  fs.writeFileSync(filePath, prettierFormattedTypescriptCode)
}
