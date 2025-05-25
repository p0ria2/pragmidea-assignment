import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";

const SOCIAL_PROVIDERS = process.env.NEXT_PUBLIC_SOCIAL_AUTH_PROVIDERS?.split(',');

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: Number(process.env.NEXT_PUBLIC_MIN_PASS_LEN),
    },
    socialProviders: SOCIAL_PROVIDERS?.reduce((acc, provider) => {
        acc[provider] = {
            enabled: true,
            clientId: process.env[`${provider.toUpperCase()}_CLIENT_ID`]!,
            clientSecret: process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]!,
        };
        return acc;
    }, {} as any)

});
