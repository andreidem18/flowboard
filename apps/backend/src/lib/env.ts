import { z } from "zod";

/**
 * Schema para validar las variables de entorno
 * Define el contrato esperado para todas las variables de entorno necesarias
 */
const envSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL debe ser una URL válida"),
});

type EnvType = z.infer<typeof envSchema>;

let envInstance: EnvType | null = null;

/**
 * Valida y parsea las variables de entorno
 * Si hay errores, lanza una excepción con detalles claros
 */
function validateEnv(): EnvType {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Error Validating env variables:");
    parsed.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();

export function getEnv(): EnvType {
  if (!envInstance) {
    envInstance = validateEnv();
  }
  return envInstance;
}

export function ensureEnvValid(): void {
  getEnv();
}
