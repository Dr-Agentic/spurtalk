import { pool, redisClient } from "../config/database";

describe("Infrastructure Validation", () => {
  describe("Database Connection", () => {
    it("should connect to PostgreSQL successfully", async () => {
      const client = await pool.connect();
      expect(client).toBeDefined();

      const result = await client.query("SELECT NOW()");
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].now).toBeDefined();

      client.release();
    });

    it("should have all required tables", async () => {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);

      const tables = result.rows.map((row) => row.table_name);
      expect(tables).toContain("users");
      expect(tables).toContain("tasks");
      expect(tables).toContain("documents");
      expect(tables).toContain("timelines");

      client.release();
    });
  });

  describe("Redis Connection", () => {
    it("should ping Redis successfully", async () => {
      const result = await redisClient.ping();
      expect(result).toBe("PONG");
    });

    it("should be able to set and get values", async () => {
      await redisClient.set("test-key", "test-value");
      const value = await redisClient.get("test-key");

      expect(value).toBe("test-value");
      await redisClient.del("test-key");
    });
  });

  describe("Docker Health Checks", () => {
    it("should have healthy containers", async () => {
      const response = await fetch("http://localhost:3000/health");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("status");
      expect(data).toHaveProperty("timestamp");
    });
  });
});
