/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import * as path from "path";
import userModel from "../app/model/user";

module Route {

    export class User {

        public isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
            var session = req.session;

            var isAuthenticated: boolean = session.userName ? true : false;
            var firstName: string        = session.userFirstName ? session.userFirstName : "";

            res.send({ isAuthenticated: isAuthenticated, firstName: firstName });
        }

        public login(req: express.Request, res: express.Response, next: express.NextFunction) {
            var username: string = req.params.username;
            var password: string = req.params.password;

            userModel.findOne({ userName: username })
                .then((err: any, doc: any) => {
                    if (doc) {
                        doc.checkPassword(password)
                            .then( (isMatch: any) => {
                                console.log(isMatch);
                                //res.send({ isAuthenticated: true, firstName: "Travis" });
                            })
                            .catch( (err: any) => {
                                res.send({ isAuthenticated: false, error: "Failed to login: Invalid username or password"});
                            });
                    } else {
                        res.send({ isAuthenticated: false, error: "Failed to login: Invalid username or password"});
                    }
                });
            // TODO: make this work properly
        }
    }
}

export = Route;
