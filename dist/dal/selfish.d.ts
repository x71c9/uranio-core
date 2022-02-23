/**
 * Class for Selfish Data Access Layer
 *
 * This class will autofix Atoms when retrieving them from the db.
 * If a property of an schema.Atom is invalid the class will try to replace with a
 * function return value or a default value defined in `atom_book`.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { RecycleDAL } from './recycle';
export declare class SelfishDAL<A extends schema.AtomName> extends RecycleDAL<A> {
    protected _replace_atom_on_error(id: string, atom: schema.Atom<A>): Promise<schema.Atom<A>>;
    protected _replace_molecule_on_error<D extends schema.Depth>(id: string, molecule: schema.Molecule<A, D>, depth?: D): Promise<schema.Molecule<A, D>>;
    private _fix_molecule_on_validation_error;
    private _fix_atom_on_validation_error;
    protected validate(molecule: schema.Atom<A>): Promise<schema.Atom<A>>;
    protected validate(molecule: schema.Atom<A>, depth?: 0): Promise<schema.Atom<A>>;
    protected validate<D extends schema.Depth>(molecule: schema.Molecule<A, D>, depth?: D): Promise<schema.Molecule<A, D>>;
}
export declare function create_selfish<A extends schema.AtomName>(atom_name: A): SelfishDAL<A>;
