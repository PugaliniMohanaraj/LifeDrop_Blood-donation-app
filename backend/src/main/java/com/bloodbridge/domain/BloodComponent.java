package com.bloodbridge.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodComponent {
    WHOLE_BLOOD("Whole Blood"),
    PACKED_RED_CELLS("Packed Red Cells"),
    PLATELETS("Platelets"),
    FRESH_FROZEN_PLASMA("Fresh Frozen Plasma");

    private final String label;

    BloodComponent(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static BloodComponent fromLabel(String label) {
        if (label == null || label.isBlank()) return WHOLE_BLOOD;
        for (BloodComponent c : values()) {
            if (c.label.equalsIgnoreCase(label)
                    || c.name().equalsIgnoreCase(label.replace(' ', '_'))) {
                return c;
            }
        }
        throw new IllegalArgumentException("Please select a valid blood component.");
    }
}
