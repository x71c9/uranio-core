/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { schema } from '../../sch/';
import { ConnectionName } from '../../typ/book_cln';
import * as mongo_connection from './connection';
export declare const mongo_app: MongoApp;
export declare function create_all_connection(): void;
export declare function get_model(conn_name: ConnectionName, atom_name: schema.AtomName): mongoose.Model<mongoose.Document<any>>;
declare type MongoApp = {
    connections?: MongoConnections;
    models?: MongoModels;
};
declare type MongoConnections = {
    [k in ConnectionName]: mongo_connection.ConnectionInstance;
};
declare type MongoModels = {
    [k in ConnectionName]: Map<schema.AtomName, mongoose.Model<mongoose.Document<any>>>;
};
export {};
