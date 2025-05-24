import { ReadonlyURLSearchParams } from "next/navigation";
import z from "zod";

export function parseUrlSearchParams<T extends z.ZodTypeAny>(searchParams: ReadonlyURLSearchParams, schema: T): z.infer<T> | null {
    const params = new URLSearchParams(searchParams);
    const parsed = schema.safeParse(Object.fromEntries(params.entries()));
    return parsed.success ? parsed.data : null;
}
