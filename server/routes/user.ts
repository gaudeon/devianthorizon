/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import * as path from "path";
import * as session from "../app/model/session";

module Route {

    export class User {

        public isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
            // res.send({ isAuthenticated: true, firstName: "Travis" });
            res.send({ isAuthenticated: false });
            // TODO: make this work properly
        }

        public login(req: express.Request, res: express.Response, next: express.NextFunction) {
            //res.send({ isAuthenticated: true, firstName: "Travis" });
            res.send({ isAuthenticated: false, error: "Failed to login" });
            // TODO: make this work properly
        }
    }
}

export = Route;
