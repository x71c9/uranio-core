/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
import { AtomName } from '../../types';
import { Relation } from '../types';
import { ConnectionName } from './types';
import { MongooseRelation } from './relation';
/**
 * Mongoose Trash Relation class
 */
export declare class MongooseTrashRelation<A extends AtomName> extends MongooseRelation<A> implements Relation<A> {
    constructor(atom_name: A);
    protected _get_conn_name(): ConnectionName;
}
export declare function trash_create<A extends AtomName>(atom_name: A): MongooseRelation<A>;
