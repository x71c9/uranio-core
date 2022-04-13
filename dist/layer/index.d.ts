/**
 * Module for commong Layer methods.
 *
 * Layer are DAL and ACL.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
export declare function search_query_object<A extends schema.AtomName>(query: string, atom_name: A): schema.Query<A>;
