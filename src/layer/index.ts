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
		const words = query.trim().split(' ');
		let regex_string = '';
		for(const word of words){
			regex_string += `(?=.*${_escape_regex(word)})|`;
		}
		regex_string = regex_string.slice(0, -1);
		regex_query[key] = {$regex: regex_string, $options: 'i'}; // $options i = case insensitive
		(search_object as any).$or.push(regex_query);
	}
	return search_object as schema.Query<A>;
}

function _escape_regex(str:string):string{
	return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // will escape all regex special chars
}
