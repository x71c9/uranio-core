/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { AtomName } from '../types';
import { BasicBLL } from './basic';
export declare class SecurityBLL<A extends AtomName> extends BasicBLL<A> {
    constructor(atom_name: A, user_groups: string[]);
}
export declare function create_security<A extends AtomName>(atom_name: A, user_groups: string[]): SecurityBLL<A>;
