/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */
import { Depth, AtomName, Atom, Molecule } from '../types';
import { RecycleDAL } from './trash';
export declare class AutoFixDAL<A extends AtomName> extends RecycleDAL<A> {
    protected _replace_atom_on_error(id: string, atom: Atom<A>): Promise<Atom<A>>;
    protected _replace_molecule_on_error<D extends Depth>(id: string, molecule: Molecule<A, D>, depth?: D): Promise<Molecule<A, D>>;
    private _fix_molecule_on_validation_error;
    private _fix_atom_on_validation_error;
    protected validate(molecule: Atom<A>): Promise<Atom<A>>;
    protected validate(molecule: Atom<A>, depth?: 0): Promise<Atom<A>>;
    protected validate<D extends Depth>(molecule: Molecule<A, D>, depth?: D): Promise<Molecule<A, D>>;
}
export declare function create_autofix<A extends AtomName>(atom_name: A): AutoFixDAL<A>;
