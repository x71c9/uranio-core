/**
 * Export modules for Mongoose schemas
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { RelationName } from '../../../types';
declare type MongoSchemas = {
    [P in RelationName]: mongoose.Schema;
};
export declare const mongo_schemas: MongoSchemas;
export declare const mongo_trash_schemas: MongoSchemas;
export {};
