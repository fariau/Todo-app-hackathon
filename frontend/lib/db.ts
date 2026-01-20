import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

// For serverless environments, we need to handle the database connection carefully
let dbInstance: ReturnType<typeof drizzle> | null = null;

const getDb = () => {
  if (!dbInstance) {
    // Use environment variable or fallback to local SQLite file
    const dbPath = process.env.DATABASE_URL || './todo_app.db';
    const sqlite = new Database(dbPath);
    dbInstance = drizzle(sqlite, { schema });

    // Run migrations in development (you might want to handle this differently in production)
    if (process.env.NODE_ENV !== 'production') {
      try {
        migrate(dbInstance, { migrationsFolder: './drizzle' });
      } catch (error) {
        console.warn('Migration failed:', error);
      }
    }
  }
  return dbInstance;
};

export { getDb };