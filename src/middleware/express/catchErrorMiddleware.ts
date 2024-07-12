import { NextFunction, Request, Response } from 'express'
import * as zod from 'zod'

export const catchErrorMiddleware = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof zod.ZodError) {
    const errors = error.issues.map((issue) => ({
      arg: issue.path.join('.'),
      message: issue.message,
    }))
    console.log(errors)
    res.status(400).json('參數錯誤')
  } else {
    next(error)
  }
}
