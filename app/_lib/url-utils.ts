import { ReadonlyURLSearchParams } from "next/navigation";
import z from "zod";

export function parseUrlSearchParams<T extends z.ZodTypeAny>(searchParams: ReadonlyURLSearchParams, schema: T): z.infer<T> | null {
    const params = new URLSearchParams(searchParams);
    const parsed = schema.safeParse(Object.fromEntries(params.entries()));
    return parsed.success ? parsed.data : null;
}

export function toSearchParams(values: Record<string, any>) {
    return Object.entries(values || {})
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}