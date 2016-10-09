/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";
import * as uuid     from "node-uuid";
import * as bcrypt   from "bcrypt-nodejs";
import * as Promise  from "bluebird";

interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    emailAddress: string;
    userName: string;
    userPassword: string;
    createdDate: Date;
};

let userSchema = new mongoose.Schema({
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
    console.log(this._doc);
    if (this._doc) {
        let doc = <IUser>this._doc;
        console.log("qwer");
console.log(doc.isModified("userPassword"));
        // only hash the password if it has been modified (or is new)
        if (!doc.isModified("userPassword")) {
            return next();
        }

        doc.userPassword = doc.generateHash(doc.userPassword);
        console.log(doc.userPassword);
    }

    next();
    return this;
});

userSchema.statics.generateHash = (password: String) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.checkPassword = (password: String) => {
    return Promise.promisify(bcrypt.compareSync)(password, this.userPassword);
};

const user = mongoose.model<IUser>("User", userSchema);

export default user;
