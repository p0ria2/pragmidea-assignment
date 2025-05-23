import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!, { schema });

export default db;
