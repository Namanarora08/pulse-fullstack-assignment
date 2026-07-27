/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const createMockModelProxy = () => {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") return undefined;
        return async (...args: any[]) => {
          if (prop === "findMany" || prop === "findRaw") return [];
          if (prop === "count") return 0;
          if (prop === "create" || prop === "createMany") return args[0]?.data ?? {};
          if (prop === "update" || prop === "updateMany" || prop === "upsert") return args[0]?.data ?? {};
          return null;
        };
      }
    }
  );
};

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
                    console.warn(
                      `[AI Studio] Prisma DB query error on ${String(prop)}.${String(modelProp)}:`,
                      err
                    );
                    if (modelProp === "findMany") return [];
                    if (modelProp === "count") return 0;
                    if (modelProp === "create" || modelProp === "createMany")
                      return args[0]?.data ?? {};
                    return null;
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
  } catch {
    console.warn("[AI Studio] Database not connected — using mock Prisma");
    return new Proxy({}, { get: () => createMockModelProxy() });
  }
}

export const prisma = globalForPrisma.prisma ?? getResilientPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
