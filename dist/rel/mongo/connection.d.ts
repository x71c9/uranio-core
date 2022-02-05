/**
 * Module for db connection
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { schema } from '../../sch/';
import { ConnectionName } from '../../typ/book_cln';
/**
 * MongooseDBConnection class
 */
declare class MongooseDBConnection {
    db_name: string;
    private _connection;
    name: ConnectionName;
    readyState: number;
    uri: string;
    /**
     * Constructor function for URNDBConnection
     *
     * @param con_name - connection name
     * @param db_host - database host
     * @param db_port - database port number
     * @param db_name - database name
     */
    constructor(con_name: ConnectionName, mongo_connection: string, db_name: string);
    /**
     * Get a relation
     *
     * @returns a Relation
     */
    create_model<A extends schema.AtomName>(relation_name: A, schema: mongoose.Schema): mongoose.Model<mongoose.Document>;
    /**
     * Close the connection
     *
     * @returns the closed URNDBConnection
     */
    close(): Promise<ConnectionInstance>;
    /**
     * Function called when event onConnecting is fired
     */
    private _on_connecting;
    /**
     * Function called when event onConnected is fired
     */
    private _on_connected;
    /**
     * Function called when event onDisconnecting is fired
     */
    private _on_disconnecting;
    /**
     * Function called when event onDisconnected id fired
     */
    private _on_disconnected;
    /**
     * Function called when event onClose is fired
     */
    private _on_close;
    /**
     * Function called when event onReconnected is fired
     */
    private _on_reconnected;
    /**
     * Function called when event onError is fired
     */
    private _on_error;
    /**
     * Function called when event onReconnectFailed is fired
     */
    private _on_reconnect_failed;
    /**
     * Function called when event onReconnectTries is fired
     */
    private _on_reconnect_tries;
}
export declare type ConnectionInstance = InstanceType<typeof MongooseDBConnection>;
export declare function create(con_name: ConnectionName, mongo_connection: string, db_name: string): ConnectionInstance;
export {};
