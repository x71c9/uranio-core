/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import { schema } from '../../sch/server';
import { ConnectionName } from '../../typ/book_cln';
import { Relation } from '../types';
import { MongooseRelation } from './relation';
/**
 * Mongoose Trash Relation class
 */
export declare class MongooseLogRelation<A extends schema.AtomName> extends MongooseRelation<A> implements Relation<A> {
    constructor(atom_name: A);
    protected _get_conn_name(): ConnectionName;
}
export declare function log_create<A extends schema.AtomName>(atom_name: A): MongooseRelation<A>;
