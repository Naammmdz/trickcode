package com.naammm.iam;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class IamApplication {

    public static void main(String... args) {
        Quarkus.run(args); // Boot Quarkus runtime
    }
}