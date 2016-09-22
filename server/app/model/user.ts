/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";
import * as uuid     from "node-uuid";
import * as bcrypt   from "bcrypt";
import * as Promise  from "bluebird";

const SALT_WORK_FACTOR = 10;

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    emailAddress: string;
    userName: string;
    userPassword: string;
    createdDate: Date;
};

export const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        index: { unique: true }
    },
    userPassword: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

userSchema.pre("save", (next: any) => {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("userPassword")) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: any) => {
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.userPassword, salt, (err: any, hash: any) => {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.userPassword = hash;
            next();
        });
    });

});

userSchema.method({
    checkPassword: (password: any, callback: any) => {
        var deferred = Promise.pending();

        bcrypt.compare(password, this.userPassword, (err: string, isMatch: boolean) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(isMatch);
            }
        });

        return deferred.promise;
    }
});

const user = mongoose.model<IUser>("User", userSchema);

export default user;
