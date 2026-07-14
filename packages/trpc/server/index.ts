import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";

export const serverRouter = router({
  health: healthRouter,
  // auth: authRouter,
  chaicode: publicProcedure
    .meta({ openapi: { method: "GET", path: "/chaicode" } })
    .input(z.object({ email: z.email(), name: z.string(), age: z.number() }))
    .output(z.object({ message: z.string(), email: z.email(), name: z.string(), age: z.number() }))
    .query(async ({ input }) => {
      return {
        message: `Hello Mr. ${input.email}`,
        email: input.email,
        name: input.name,
        age: input.age
      }
    }),
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
