import {z} from "zod";
import "dotenv/config";


const envSchema = z.object({
    DATABASE_URL : z.string().url(),
    JWT_SECRET : z.string().min(1),
    GEMINI_API_KEY : z.string().min(1),
    OPENROUTER_API_KEY : z.string().min(1)
})

export const env =  envSchema.parse(process.env);