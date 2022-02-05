/**
 * Default Class for Data Access Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
import { SelfishDAL } from './selfish';
export declare class DAL<A extends schema.AtomName> extends SelfishDAL<A> {
}
export declare function create<A extends schema.AtomName>(atom_name: A): DAL<A>;
