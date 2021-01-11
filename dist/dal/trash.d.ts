/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */
import { AtomName, Atom } from '../types';
import { AbstractDAL } from './abs';
import { EncryptDAL } from './encrypt';
export declare class RecycleDAL<A extends AtomName> extends EncryptDAL<A> {
    trash_dal: AbstractDAL<A>;
    constructor(atom_name: A);
    delete_by_id(id: string): Promise<Atom<A>>;
}
export declare function create_recycle<A extends AtomName>(atom_name: A): EncryptDAL<A>;
