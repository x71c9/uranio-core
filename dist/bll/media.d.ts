/// <reference types="node" />
import { schema } from '../sch/server';
import { Passport } from '../typ/auth';
import * as sto from '../sto/server';
import { BLL } from './bll';
import { InsertFileParams } from './types';
export declare class MediaBLL extends BLL<'media'> {
    protected storage: sto.Storage;
    constructor(passport?: Passport);
    insert_file(filepath: string, buffer: Buffer | ArrayBuffer | Blob, params?: Partial<InsertFileParams>): Promise<schema.Atom<'media'>>;
    presigned(filepath: string, params?: Partial<InsertFileParams>): Promise<string>;
    find<D extends schema.Depth>(query: schema.Query<'media'>, options?: schema.Query.Options<'media', D>): Promise<schema.Molecule<'media', D>[]>;
    find_by_id<D extends schema.Depth>(id: string, options?: schema.Query.Options<'media', D>): Promise<schema.Molecule<'media', D>>;
    find_one<D extends schema.Depth>(query: schema.Query<'media'>, options?: schema.Query.Options<'media', D>): Promise<schema.Molecule<'media', D>>;
    insert_new(atom_shape: schema.AtomShape<'media'>): Promise<schema.Atom<'media'>>;
    update_by_id<D extends schema.Depth>(id: string, partial_atom: Partial<schema.AtomShape<'media'>>, options?: schema.Query.Options<'media', D>): Promise<schema.Molecule<'media', D>>;
    update_one<D extends schema.Depth>(atom: schema.Atom<'media'>, options?: schema.Query.Options<'media', D>): Promise<schema.Molecule<'media', D>>;
    update_multiple(ids: string[], partial_atom: Partial<schema.AtomShape<'media'>>): Promise<schema.Atom<'media'>[]>;
    insert_multiple(atom_shapes: schema.AtomShape<'media'>[]): Promise<schema.Atom<'media'>[]>;
    remove_multiple(ids: string[]): Promise<schema.Atom<'media'>[]>;
    private _remove_full_src;
    private _with_full_src;
    private _array_with_full_src;
    private _is_already_stored;
}
export declare function create(passport?: Passport): MediaBLL;
