/**
 * Class for Main Data Access Layer
 *
 * This class will select the Relation the DAL should use.
 * Check the type of DB defined in the config.
 * Use a Log Relation if the Atom has the `connection` property set to `log`.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { BasicDAL } from './basic';
export declare class RelationDAL<A extends schema.AtomName> extends BasicDAL<A> {
    constructor(atom_name: A);
}
export declare function create_main<A extends schema.AtomName>(atom_name: A): RelationDAL<A>;
