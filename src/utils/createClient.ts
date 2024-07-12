import { routing } from '@/routes'
import { Integration } from 'express-zod-api'
import fs from 'fs'

export async function createClient(filePath: string) {
  const client = new Integration({
    routing: routing,
    variant: 'client', // <— optional, see also "types" for a DIY solution
    optionalPropStyle: { withQuestionMark: true, withUndefined: true }, // optional
    splitResponse: false, // optional, prints the positive and negative response types separately
  })
  const prettierFormattedTypescriptCode = await client.printFormatted() // or just .print() for unformatted
  fs.writeFileSync(filePath, prettierFormattedTypescriptCode)
}
