package com.bloodbridge.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Adds columns introduced after initial deploy (dev databases without Flyway). */
@Component
@Order(0)
public class SchemaPatchRunner implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    public SchemaPatchRunner(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        jdbc.execute("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS province VARCHAR(255)");
        jdbc.execute("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS district VARCHAR(255)");

        jdbc.execute(
                "ALTER TABLE blood_stock ADD COLUMN IF NOT EXISTS component VARCHAR(255) DEFAULT 'WHOLE_BLOOD'");
        jdbc.execute("ALTER TABLE blood_stock ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP");
        jdbc.execute("ALTER TABLE blood_stock ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");
        jdbc.execute("ALTER TABLE blood_stock ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");

        jdbc.update(
                "UPDATE blood_stock SET component = 'WHOLE_BLOOD' WHERE component IS NULL");
        jdbc.update(
                "UPDATE blood_stock SET last_updated = NOW() WHERE last_updated IS NULL");
        jdbc.update(
                "UPDATE blood_stock SET created_at = NOW() WHERE created_at IS NULL");
        jdbc.update(
                "UPDATE blood_stock SET updated_at = NOW() WHERE updated_at IS NULL");
    }
}
