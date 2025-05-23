import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: Number(process.env.NEXT_PUBLIC_MIN_PASS_LEN),
    },
    socialProviders: {
        google: {
            enabled: true,
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    }
});
