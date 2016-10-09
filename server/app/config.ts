/// <reference path="../_all.d.ts" />

import databaseConfig from "./config/database";
import sessionConfig from "./config/session";
import overrideConfig from "./config/override";

class Config {
    public config: any;

    public constructor() {
        this.config = {};

        this.config.database = databaseConfig;
        this.config.session = sessionConfig;

        this.config = this.processOverrides(this.config, overrideConfig);
    }

    private processOverrides(config: any, overrides: any) {
        for (let key in overrides) {
            if (overrides.hasOwnProperty(key)) {
                if ("object" === typeof overrides[key]) {
                    config[key] = this.processOverrides(config[key], overrides[key]);
                } else {
                    config[key] = overrides[key];
                }
            }
        }

        return config;
    }
}

export default new Config();