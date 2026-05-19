-- Make fuzzy_deadline and hard_deadline nullable on tasks table
-- These fields are optional in the UI and the Zod schema (CreateTaskSchema),
-- but the initial migration created them as NOT NULL. This caused P2011
-- constraint violations when users created tasks without selecting a deadline.

ALTER TABLE "tasks" ALTER COLUMN "fuzzy_deadline" DROP NOT NULL;
ALTER TABLE "tasks" ALTER COLUMN "hard_deadline" DROP NOT NULL;