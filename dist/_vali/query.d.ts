/**
 *
 * Validator for query paramters
 *
 * @packageDocumentation
 */
import { QueryOptions, FilterType, AtomProperties } from '../types';
import * as urn_atms from '../atm/';
/**
 * Validate `filter` and `options` paramaters
 *
 * @param atom_properties - The Atom module that is needed to check the keys
 * @param filter - the filter object
 * @param options- the options object
 */
export declare function validate_filter_options_params<M extends urn_atms.models.Resource>(atom_properties: AtomProperties, filter: FilterType<M>, options?: QueryOptions<M>): true;
/**
 * Validate projection object for querying Relation. used in find, find_one, ...
 *
 * @param projection - The projection to validate
 *
 */
