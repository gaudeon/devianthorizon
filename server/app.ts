/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as mongoose from "mongoose";
import * as session from "express-session";
import * as connectMongo from "connect-mongo";

// config
import appConfig from "./app/config";

// routes
import * as indexRoute from "./routes/index";
import * as userRoute from "./routes/user";



/**
 * The server.
 *
 * @class Server
 */
class Server {

  public app: express.Application;

  private mongoStore: connectMongo.MongoStoreFactory;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //configure routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // connect to database
    mongoose.connect("mongodb://localhost/" + appConfig.config.database.name);

    // Use bluebird promises for mongoose
    mongoose.Promise = require("bluebird");

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));

    //add static paths
    this.app.use("/public", express.static(path.join(__dirname, "../client/public")));

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    // setup session support using express session and mongodb
    this.mongoStore = connectMongo(session);

    let sessionOptions   = appConfig.config.session;
    sessionOptions.store = new this.mongoStore({ mongooseConnection: mongoose.connection });

    if (this.app.get("env") === "production") {
        this.app.set("trust proxy", 1); // trust first proxy
        sessionOptions.cookie.secure = true; // serve secure cookies
    }

    this.app.use(session(sessionOptions));
  }

  /**
   * Configure routes
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    //get router
    let router: express.Router;
    router = express.Router();

    //create routes
    var index: indexRoute.Index = new indexRoute.Index();
    var user: userRoute.User = new userRoute.User();

    //home page
    router.get("/", index.index.bind(index.index));

    //user functions
    router.get("/user/isAuthenticated", user.isAuthenticated.bind(user.isAuthenticated));
    router.post("/user/login", user.login.bind(user.login));

    //use router middleware
    this.app.use(router);
  }
}

var server = Server.bootstrap();
export = server.app;
