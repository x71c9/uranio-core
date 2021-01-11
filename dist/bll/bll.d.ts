/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { AtomName } from '../types';
import { SecurityBLL } from './security';
export declare class BLL<A extends AtomName> extends SecurityBLL<A> {
}
export declare function create<A extends AtomName>(atom_name: A, user_groups: string[]): BLL<A>;
