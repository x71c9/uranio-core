/**
 * Query type module
 *
 * @packageDocumentation
 */

import {
	AtomName,
	Atom,
	Depth
} from './atom';

export type Query<A extends AtomName> = Query.Expression<A> | Query.Logical<A>;

export namespace Query {

	type Base = string | number | boolean | Date;

	type Equal<A extends AtomName> = {
		[P in keyof Atom<A>]?: Base;
	}

	type Comparsion =
		{ $eq?: Base } |
		{ $gt?: Base } |
		{ $gte?: Base } |
		{ $in?: Base[] } |
		{ $lt?: Base } |
		{ $lte?: Base } |
		{ $ne?: Base } |
		{ $nin?: Base[] }

	type WithComparsion<A extends AtomName> = {
		[P in keyof Atom<A>]?: Comparsion;
	}

	export type Expression<A extends AtomName> = Equal<A> | WithComparsion<A>;

	export type Logical<A extends AtomName> =
		{ $and?: (Expression<A> | Logical<A>)[] } |
		{ $not?: Expression<A> | Logical<A> } |
		{ $nor?: (Expression<A> | Logical<A>)[] } |
		{ $or?: (Expression<A>  | Logical<A>)[] }

	// const a1:Query<'superuser'> = {email: ''};
	// const a2:Query<'superuser'> = {email: {$eq: ''}};
	// const a3:Query<'superuser'> = {$and: [{email: ''}, {password: {$lte: 3}}]};
	// const a4:Query<'superuser'> = {$or: []};
	// const a5:Query<'superuser'> = {$nor: [{$and: []}]};
	// const a6:Query<'superuser'> = {$not: {email: ''}};
	// const a7:Query<'superuser'> = {$nor:[{$not: {$and:[{password: {$nin: ['']}}]}}]};
	// console.log(a1,a2,a3,a4,a5,a6,a7);

	export type Options<A extends AtomName, D extends Depth = 0> = {
		depth?: D,
		sort?: string | Equal<A>;
		limit?: number;
		skip?: number;
	}
	
}
