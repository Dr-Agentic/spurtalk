import { pool, redisClient } from "../config/database";

beforeAll(async () => {
  // Ensure we start with a clean state if possible, or just connect
  try {
    // pool.connect() returns a client, we just want to ensure pool is ready?
    // actually pool manages itself. We don't strictly need to "connect" the pool globally
    // but the tests expect 'pool' to be usable.
    // The previous code did pool.connect() which checks out a client then discards it.
    // That might leave a client checked out if not released?
    // Yes! `await pool.connect()` checks out a client. If we don't release it, it hangs?
    // Let's check pool usage.

    // Actually, for Redis:
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (e) {
    console.error("Setup connection error", e);
  }
});

afterAll(async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    // pool.end() closes all clients.
    await pool.end();
  } catch (e) {
    console.error("Teardown error", e);
  }
});
