/**
 * Class for Advanced Data Access Layer
 *
 * @packageDocumentation
 */
import { AtomName } from '../types';
import { SelfishDAL } from './selfish';
export declare class AdvancedDAL<A extends AtomName> extends SelfishDAL<A> {
}
export declare function create<A extends AtomName>(atom_name: A): AdvancedDAL<A>;
