/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import * as path from "path";
import userModel from "../app/model/user";

interface IUserSession extends Express.Session {
    userName: string;
    userFirstName: string;
}

module Route {

    export class User {

        public isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
            let session: IUserSession = <IUserSession>req.session;

            let isAuthenticated: boolean = session.userName ? true : false;
            let firstName: string        = session.userFirstName ? session.userFirstName : "";

            res.send({ isAuthenticated: isAuthenticated, firstName: firstName });
        }

        public login(req: express.Request, res: express.Response, next: express.NextFunction) {
            let username: string = req.param("username");
            let password: string = req.param("password");

            userModel.findOne({ userName: username })
                .then((doc: any) => {
                    if (doc) {
                        doc.userPassword = "1mlg0w1cc";
                        doc.save();
                        doc.checkPassword(password)
                            .then( (isMatch: any) => {
                                console.log(isMatch);
                                //res.send({ isAuthenticated: true, firstName: "Travis" });
                            })
                            .catch( (err: any) => {
                                //console.log(err);
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
