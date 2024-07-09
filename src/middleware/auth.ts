import { z } from "zod";
import createHttpError from "http-errors";
import { Middleware } from "express-zod-api";

export const authMiddleware = new Middleware({
  security: {
    // this information is optional and used for generating documentation
    and: [
      { type: "input", name: "key" },
      { type: "header", name: "token" },
    ],
  },
  input: z.object({
    key: z.string().optional(),
  }),
  handler: async ({ input: { key }, request, logger }) => {
    logger.debug("Checking the key and token");
    const user = { token: key };
    if (!user) {
      throw createHttpError(401, "Invalid key");
    }
    if (request.headers.token !== user.token) {
      throw createHttpError(401, "Invalid token");
    }
    return { user }; // provides endpoints with options.user
  },
});
