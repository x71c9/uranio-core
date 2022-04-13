/**
 * Module for commong Layer methods.
 *
 * Layer are DAL and ACL.
 *
 * @packageDocumentation
 */

import {schema} from '../sch/server';

// import {Book} from '../server/types';

// import * as book from '../book/server';

import * as atm from '../atm/server';

// import {urn_util} from 'urn-lib';

type RegexQuery<A extends schema.AtomName> = {
	[k in keyof schema.Atom<A>]: {$regex: string, $options: string}
}

export function search_query_object<A extends schema.AtomName>(
	query:string,
	atom_name:A
):schema.Query<A>{
	// const search_object = {$or: [{$text: {$search: query}}]} as schema.Query.Logical<A>;
	const search_object = {$or: []} as schema.Query.Logical<A>;
	const search_keys = atm.keys.get_search_indexes(atom_name);
	for(const key of search_keys){
		const regex_query = {} as RegexQuery<A>;
		regex_query[key] = {$regex: query, $options: 'i'}; // $options i = case insensitive
		(search_object as any).$or.push(regex_query);
	}
	return search_object as schema.Query<A>;
}
