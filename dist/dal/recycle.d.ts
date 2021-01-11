/**
 * Class for Recycle Data Access Layer
 *
 * @packageDocumentation
 */
import { AtomName, Atom } from '../types';
import { BasicDAL } from './basic';
import { EncryptDAL } from './encrypt';
export declare class RecycleDAL<A extends AtomName> extends EncryptDAL<A> {
    trash_dal: BasicDAL<A>;
    constructor(atom_name: A);
    delete_by_id(id: string): Promise<Atom<A>>;
}
export declare function create_recycle<A extends AtomName>(atom_name: A): RecycleDAL<A>;
