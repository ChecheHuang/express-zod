import { NextFunction, Request, Response } from 'express'

import chalk from 'chalk'
import { SERVER_ADDRESS } from '../../config'

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = new Date()
  const year = start.getFullYear()
  const month = String(start.getMonth() + 1).padStart(2, '0')
  const day = String(start.getDate()).padStart(2, '0')
  const hours = String(start.getHours()).padStart(2, '0')
  const minutes = String(start.getMinutes()).padStart(2, '0')
  const seconds = String(start.getSeconds()).padStart(2, '0')
  const reqUrl = req.originalUrl || req.url
  const method = req.method
  const [path, query] = reqUrl.split('?')
  const queryString = query ? `?${query}` : ''
  console.log(`${method.padStart(6, ' ')} ${SERVER_ADDRESS}${chalk.yellowBright(path)}${chalk.greenBright(queryString)}`)

  res.on('finish', () => {
    // const end = new Date()
    // const duration = end.getTime() - start.getTime()
    // console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${method} ${url}${reqUrl} 計時${duration}毫秒`)
  })
  next()
}
