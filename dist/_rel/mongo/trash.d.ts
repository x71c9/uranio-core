/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import * as urn_atm from '../../atm/';
import { Relation } from '../types';
import * as mongo_connection from './connection';
import { MongooseRelation } from './relation';
/**
 * Mongoose Trash Relation class
 */
export declare class MongooseTrashRelation<M extends urn_atm.models.Resource> extends MongooseRelation<M> implements Relation<M> {
    relation_name: string;
    constructor(relation_name: string);
    protected _get_connection(): mongo_connection.ConnectionInstance;
    protected _complie_mongoose_model(): mongoose.Model<mongoose.Document>;
}
