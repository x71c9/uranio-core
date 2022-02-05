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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('DBC_M', 'Mongoose DB Connection');
/*
 * Define default mongoose option for connection
 */
const mongoose_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};
// const mongoose_options:mongoose.ConnectOptions = {
// };
/**
 * MongooseDBConnection class
 */
let MongooseDBConnection = class MongooseDBConnection {
    /**
     * Constructor function for URNDBConnection
     *
     * @param con_name - connection name
     * @param db_host - database host
     * @param db_port - database port number
     * @param db_name - database name
     */
    constructor(con_name, mongo_connection, db_name) {
        this.db_name = db_name;
        this.name = con_name;
        this.uri = `${mongo_connection}/${this.db_name}?retryWrites=true&w=majority`;
        this.readyState = 0;
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
    /**
     * Get a relation
     *
     * @returns a Relation
     */
    create_model(relation_name, schema) {
        return this._connection.model(relation_name, schema);
    }
    /**
     * Close the connection
     *
     * @returns the closed URNDBConnection
     */
    async close() {
        if (this._connection == null) {
            const err_msg = `Cannot close. Connection is null. [${this.name}][${this.uri}].`;
            throw urn_exc.create('CLOSE_CON_NULL', err_msg);
        }
        await this._connection.close();
        return this;
    }
    // public is_valid_id(id:string)
    //     :boolean{
    //   return mongoose.Types.ObjectId.isValid(id);
    // }
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
        const err_msg = `General Error.`;
        throw urn_exc.create('ERR', err_msg, e);
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
MongooseDBConnection = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], MongooseDBConnection);
function create(con_name, mongo_connection, db_name) {
    urn_lib_1.urn_log.fn_debug(`Create MongooseDBConnection [${con_name}]`);
    return new MongooseDBConnection(con_name, mongo_connection, db_name);
}
exports.create = create;
//# sourceMappingURL=connection.js.map