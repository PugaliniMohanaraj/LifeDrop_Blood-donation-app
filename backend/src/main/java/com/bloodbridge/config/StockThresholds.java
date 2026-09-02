package com.bloodbridge.config;

/** Configurable thresholds for blood availability status (HCI / ops tuning). */
public final class StockThresholds {
    private StockThresholds() {}

    /** Units above this value are AVAILABLE. */
    public static final int AVAILABLE_MIN_UNITS = 11;

    /** Units from 1 through this value (inclusive) are LOW stock. */
    public static final int LOW_STOCK_MAX_UNITS = 10;
}
