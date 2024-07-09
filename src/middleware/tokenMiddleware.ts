import { REFRESH_TOKEN_EXPIRE_TIME, TOKEN_EXPIRE_TIME, TOKEN_SECRET } from '@/config'
import { Handler, Request } from 'express'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
declare global {
  namespace Express {
    interface Request {
      user?: TokenType
    }
  }
}
export type TokenType = {
  id: string
  account: string
}
export const createToken = ({ id, account }: TokenType) => {
  const access_token = signToken(
    {
      id,
      account,
    },
    TOKEN_EXPIRE_TIME
  )
  const refresh_token = signToken(
    {
      id,
      account,
    },
    REFRESH_TOKEN_EXPIRE_TIME
  )
  // console.log(access_token)
  return { access_token, refresh_token }
}

export const signToken = (payload: JwtPayload, expiresIn?: string | number): string => {
  const options = expiresIn ? { expiresIn } : {}
  const token = jwt.sign(payload, TOKEN_SECRET || '', options)
  return token
}

export const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET || '', (error, decoded) => {
      if (error) {
        if (error instanceof TokenExpiredError) {
          reject('Token已過期')
        }
        reject('身分驗證失敗')
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

const getTokenFromHeader = (req: Request): string => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || ''
    return token
  } catch (error) {
    return ''
  }
}

const tokenMiddleware: Handler = async (req, res, next) => {
  const token = getTokenFromHeader(req)
  try {
    const decoded = await verifyToken(token)
    req.user = decoded as TokenType
    next()
  } catch (error) {
    res.status(401).json(error)
  }
}

export default tokenMiddleware
