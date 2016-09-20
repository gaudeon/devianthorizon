/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";
import * as uuid     from "node-uuid";

export interface ISession extends mongoose.Document {
    tokenString: string;
    ipAddress: string;
    expireDate: Date;
    sessionData: string;
};

export const sessionSchema = new mongoose.Schema({
    tokenString: {
        type: String,
        required: true,
        default: function() { return uuid.v4(); }
    },
    ipAddress: {
        type: String,
        required: true
    },
    expireDate: {
        type: Date,
        required: true,
        default: function() {
            let now: number = Date.now() + (1000 * 60 * 60 * 1);
            return new Date(now);
        },
        expires: 0
    },
    sessionData : {
        type : String,
        default: "{}",
        get: function(data: any) { return JSON.parse(data); },
        set: function(data: any) { return JSON.stringify(data); }
    }
});

const session = mongoose.model<ISession>("Session", sessionSchema);

export default session;
