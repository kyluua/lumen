package com.lumen.core;

public enum ReleaseLine {
    STABLE("stable"),
    BETA("beta"),
    NIGHTLY("nightly"),
    LUMEN_26_1("26.1.x"),
    LUMEN_26_2("26.2.x");

    private final String label;

    ReleaseLine(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
