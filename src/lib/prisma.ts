/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

import { isDatabaseUnavailableError } from "@/lib/api/errors";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

/**
 * Read-only queries may degrade to empty results when the database is
 * unreachable; writes must always fail loudly so callers never see a
 * fabricated success.
 */
const READ_ONLY_METHODS = new Set([
  "findMany",
  "findFirst",
  "findUnique",
  "findRaw",
  "count",
  "aggregate",
  "groupBy"
]);

function degradedReadResult(method: string) {
  if (method === "findMany" || method === "findRaw" || method === "groupBy") return [];
  if (method === "count") return 0;
  return null;
}

function getResilientPrismaClient() {
  try {
    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"]
    });

    return new Proxy(client as any, {
      get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver);
        if (typeof orig === "object" && orig !== null) {
          return new Proxy(orig, {
            get(modelTarget, modelProp) {
              const modelMethod = Reflect.get(modelTarget, modelProp);
              if (typeof modelMethod === "function") {
                return async (...args: any[]) => {
                  try {
                    return await modelMethod.apply(modelTarget, args);
                  } catch (err) {
                    const operation = `${String(prop)}.${String(modelProp)}`;
                    const method = String(modelProp);

                    if (isDatabaseUnavailableError(err) && READ_ONLY_METHODS.has(method)) {
                      console.error(
                        `[prisma] database unavailable during ${operation}, returning empty result:`,
                        err
                      );
                      return degradedReadResult(method);
                    }

                    console.error(`[prisma] query failed on ${operation}:`, err);
                    throw err;
                  }
                };
              }
              return modelMethod;
            }
          });
        }
        return orig;
      }
    });
  } catch (err) {
    console.error("[prisma] failed to instantiate PrismaClient:", err);
    throw err;
  }
}

export const prisma = globalForPrisma.prisma ?? getResilientPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
