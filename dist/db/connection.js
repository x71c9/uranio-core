"use strict";
/**
 * Module for db connection
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
/*
 * Import mogoose
 */
const mongoose_1 = __importDefault(require("mongoose"));
/*
 * Import uranio library
 */
const urn_lib_1 = require("urn-lib");
/*
 * Import Relation class
 */
const relation_1 = require("./relation");
/*
 * Define default mongoose option for connection
 */
const mongoose_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};
/**
 * DBConnection class
 */
let DBConnection = class DBConnection {
    /**
     * Constructor function for URNDBConnection
     *
     * @param con_name - connection name
     * @param db_host - database host
     * @param db_port - database port number
     * @param db_name - database name
     */
    constructor(con_name, db_host, db_port, db_name) {
        this.db_host = db_host;
        this.db_port = db_port;
        this.db_name = db_name;
        this.name = con_name;
        this.uri = `mongodb://${this.db_host}:${this.db_port}/${this.db_name}`;
        this.readyState = 0;
        try {
            this._connection = mongoose_1.default.createConnection(this.uri, mongoose_options);
            this._connection.on('connecting', () => { this._on_connecting(); });
            this._connection.on('connected', () => { this._on_connected(); });
            this._connection.on('disconnecting', () => { this._on_disconnecting(); });
            this._connection.on('disconnected', () => { this._on_disconnected(); });
            this._connection.on('close', () => { this._on_close(); });
            this._connection.on('reconnected', () => { this._on_reconnected(); });
            this._connection.on('error', (err) => { this._on_error(err); });
            this._connection.on('reconnectFailed', () => { this._on_reconnect_failed(); });
            this._connection.on('reconnectTries', () => { this._on_reconnect_tries(); });
            return this;
        }
        catch (err) {
            throw urn_lib_1.urn_error.create(`Cannot create connection to ${this.uri} - ${err.message}`, err);
        }
    }
    /**
     * Get a relation
     *
     * @returns a Relation
     */
    get_relation(relation_name, schema) {
        const raw_relation = this._connection.model(relation_name, schema);
        return new relation_1.Relation(raw_relation);
    }
    /**
     * Close the connection
     *
     * @returns the closed URNDBConnection
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection == null)
                throw urn_lib_1.urn_error.create(`Trying to close a connection that was never created [${this.name}][${this.uri}]`);
            try {
                yield this._connection.close();
                return this;
            }
            catch (err) {
                throw urn_lib_1.urn_error.create(`Cannot disconnect from [${this.name}][${this.uri}] - ${err.message}`, err);
            }
        });
    }
    is_valid_id(id) {
        return mongoose_1.default.Types.ObjectId.isValid(id);
    }
    /**
     * Function called when event onConnecting is fired
     */
    _on_connecting() {
        urn_lib_1.urn_log.debug(`Connection connecting [${this.name}][${this.uri}]...`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onConnected is fired
     */
    _on_connected() {
        urn_lib_1.urn_log.debug(`Connection connected [${this.name}][${this.uri}]`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onDisconnecting is fired
     */
    _on_disconnecting() {
        urn_lib_1.urn_log.debug(`Connection disconnecting [${this.name}][${this.uri}]...`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onDisconnected id fired
     */
    _on_disconnected() {
        urn_lib_1.urn_log.debug(`Connection disconnected [${this.name}][${this.uri}]`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onClose is fired
     */
    _on_close() {
        urn_lib_1.urn_log.debug(`Connection closed [${this.name}][${this.uri}]`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onReconnected is fired
     */
    _on_reconnected() {
        urn_lib_1.urn_log.debug(`Connection reconnected [${this.name}][${this.uri}]`);
        if (this._connection)
            this.readyState = this._connection.readyState;
    }
    /**
     * Function called when event onError is fired
     */
    _on_error(e) {
        throw urn_lib_1.urn_error.create(e.message, e);
    }
    /**
     * Function called when event onReconnectFailed is fired
     */
    _on_reconnect_failed() {
        urn_lib_1.urn_log.debug(`Connection reconnectFailed [${this.name}][${this.uri}]`);
    }
    /**
     * Function called when event onReconnectTries is fired
     */
    _on_reconnect_tries() {
        urn_lib_1.urn_log.debug(`Connection reconnectTries [${this.name}][${this.uri}]`);
    }
};
DBConnection = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], DBConnection);
function create(con_name, db_host, db_port, db_name) {
    return new DBConnection(con_name, db_host, db_port, db_name);
}
exports.create = create;
//# sourceMappingURL=connection.js.map