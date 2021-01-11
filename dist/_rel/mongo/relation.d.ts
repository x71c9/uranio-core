/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { FilterType, QueryOptions } from '../../types';
import { Relation } from '../types';
import * as mongo_connection from './connection';
import * as urn_atm from '../../atm/';
/**
 * Mongoose Relation class
 */
export declare class MongooseRelation<M extends urn_atm.models.Resource> implements Relation<M> {
    relation_name: string;
    protected _conn: mongo_connection.ConnectionInstance;
    protected _raw: mongoose.Model<mongoose.Document>;
    constructor(relation_name: string);
    protected _get_connection(): mongo_connection.ConnectionInstance;
    protected _complie_mongoose_model(): mongoose.Model<mongoose.Document>;
    find(filter: FilterType<M>, options?: QueryOptions<M>): Promise<M[]>;
    find_by_id(id: string): Promise<M>;
    find_one(filter: FilterType<M>, options?: QueryOptions<M>): Promise<M>;
    insert_one(resource: M): Promise<M>;
    alter_one(resource: M): Promise<M>;
    delete_one(resource: M): Promise<M>;
    is_valid_id(id: string): boolean;
}
