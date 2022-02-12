/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
/**
 * Validate `query` and `options` paramaters
 *
 * @param atom_name - The schema.Atom module that is needed to check the keys
 * @param query - the query object
 * @param options- the options object
 */
export declare function validate_filter_options_params<A extends schema.AtomName, D extends schema.Depth>(atom_name: A, query: schema.Query<A>, options?: schema.Query.Options<A, D>): true;
/**
 * Validate projection object for querying Relation. used in find, find_one, ...
 *
 * @param projection - The projection to validate
 *
 */
