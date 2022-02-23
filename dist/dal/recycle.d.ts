/**
 * Class for Recycle Data Access Layer
 *
 * This class will move a deleted schema.Atom to the Trash database instead of just
 * deleting it.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { BasicDAL } from './basic';
import { EncryptDAL } from './encrypt';
export declare class RecycleDAL<A extends schema.AtomName> extends EncryptDAL<A> {
    private _trash_dal?;
    get trash_dal(): BasicDAL<A>;
    delete_by_id(id: string): Promise<schema.Atom<A>>;
    delete_multiple(ids: string[]): Promise<schema.Atom<A>[]>;
}
export declare function create_recycle<A extends schema.AtomName>(atom_name: A): RecycleDAL<A>;
