package com.bloodbridge.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodGroup {
    A_POS("A+"),
    A_NEG("A-"),
    B_POS("B+"),
    B_NEG("B-"),
    AB_POS("AB+"),
    AB_NEG("AB-"),
    O_POS("O+"),
    O_NEG("O-");

    private final String label;

    BloodGroup(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static BloodGroup fromLabel(String label) {
        for (BloodGroup g : values()) {
            if (g.label.equalsIgnoreCase(label) || g.name().equalsIgnoreCase(label)) return g;
        }
        throw new IllegalArgumentException("Please select a valid blood group.");
    }
}
