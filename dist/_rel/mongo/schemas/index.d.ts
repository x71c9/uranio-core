/**
 * Export modules for Mongoose schemas
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
declare type MongoSchemas = {
    [k: string]: mongoose.Schema;
};
export declare const mongo_schemas: MongoSchemas;
export declare const mongo_trash_schemas: MongoSchemas;
export {};
