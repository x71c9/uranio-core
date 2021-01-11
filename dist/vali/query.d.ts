/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */
import { Depth, Query, AtomName } from '../types';
/**
 * Validate `query` and `options` paramaters
 *
 * @param atom_name - The Atom module that is needed to check the keys
 * @param query - the query object
 * @param options- the options object
 */
export declare function validate_filter_options_params<A extends AtomName, D extends Depth>(atom_name: A, query: Query<A>, options?: Query.Options<A, D>): true;
/**
 * Validate projection object for querying Relation. used in find, find_one, ...
 *
 * @param projection - The projection to validate
 *
 */
