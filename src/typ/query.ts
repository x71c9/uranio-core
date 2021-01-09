/**
 * Query type module
 *
 * @packageDocumentation
 */

import {
	AtomName,
	// Atom,
	Depth,
	KeyOfHardProperties,
	KeyOfCommonProperties,
	RealTypeOfAtomHardProperty,
	RealTypeOfAtomCommonProperty,
	RealTypeOfAtomProperty,
	KeyOfPropertyOfAtomDefinition,
} from './atom';

export type Query<A extends AtomName> = Query.Expression<A> | Query.Logical<A>;

export namespace Query {

	// type Base = string | number | boolean | Date;

	// type Equal<A extends AtomName> = Partial<Atom<A>>;

	// type Equal<A extends AtomName> = {
	//   [k in keyof Atom<A>]?: Base
	// }
	
	// export type Equal<A extends AtomName> =
	//   { [P in KeyOfHardProperties]?: RealTypeOfAtomHardProperty<P> } &
	//   { [P in KeyOfCommonProperties]?: RealTypeOfAtomCommonProperty<P> } &
	//   { [P in KeyOfPropertyOfAtomDefinition<A>]?: RealTypeOfAtomProperty<A,P>}
	
	// type Comparsion<A extends AtomName> =
	//   { $eq?: Equal<A> } |
	//   { $gt?: Equal<A> } |
	//   { $gte?: Equal<A> } |
	//   { $in?: Equal<A>[] } |
	//   { $lt?: Equal<A> } |
	//   { $lte?: Equal<A> } |
	//   { $ne?: Equal<A> } |
	//   { $nin?: Equal<A>[] }

	// type WithComparsion<A extends AtomName> = {
	//   [k in keyof Atom<A>]?: Comparsion<A>
	// }
	
	// type WithComparsion<A extends AtomName> =
		// { [P in KeyOfHardProperties]?: Comparsion<RealTypeOfAtomHardProperty<P>> } &
		// { [P in KeyOfCommonProperties]?: Comparsion<RealTypeOfAtomCommonProperty<P>> } &
		// { [P in KeyOfPropertyOfAtomDefinition<A>]?: Comparsion<RealTypeOfAtomProperty<A,P>>}

	type QueryAtomKey<A extends AtomName> =
		KeyOfHardProperties | KeyOfCommonProperties | KeyOfPropertyOfAtomDefinition<A>;
	
	type QueryAtomRealType<A extends AtomName, P extends QueryAtomKey<A>> =
		P extends KeyOfHardProperties ? RealTypeOfAtomHardProperty<P> :
		P extends KeyOfCommonProperties ? RealTypeOfAtomCommonProperty<P> :
		P extends KeyOfPropertyOfAtomDefinition<A> ? RealTypeOfAtomProperty<A,P> :
		never;

	export type Equal<A extends AtomName> =
		{ [P in QueryAtomKey<A>]?: QueryAtomRealType<A,P> }

	type Comparsion<T> =
		{ $eq?: T } |
		{ $gt?: T } |
		{ $gte?: T } |
		{ $in?: T[] } |
		{ $lt?: T } |
		{ $lte?: T } |
		{ $ne?: T } |
		{ $nin?: T[] } |
		{ $exists: boolean}

	type WithComparsion<A extends AtomName> =
		{ [P in QueryAtomKey<A>]?: Comparsion<QueryAtomRealType<A,P>> }

	export type Expression<A extends AtomName> = Equal<A> | WithComparsion<A>;

	export type Logical<A extends AtomName> =
		{ $and?: (Expression<A> | Logical<A>)[] } |
		{ $not?: Expression<A> | Logical<A> } |
		{ $nor?: (Expression<A> | Logical<A>)[] } |
		{ $or?: (Expression<A>  | Logical<A>)[] }

	export type Options<A extends AtomName, D extends Depth = 0> = {
		depth?: D,
		sort?: string | Equal<A>;
		limit?: number;
		skip?: number;
		depth_query?:Query<A>
	}
	
	// const a1:Query<'superuser'> = {email: ''};
	// const a2:Query<'superuser'> = {email: {$eq: ''}};
	// const a3:Query<'superuser'> = {$and: [{email: ''}, {password: {$lte: ''}}]};
	// const a4:Query<'superuser'> = {$or: []};
	// const a5:Query<'superuser'> = {$nor: [{$and: []}]};
	// const a6:Query<'superuser'> = {$not: {email: ''}};
	// const a7:Query<'superuser'> = {$nor:[{$not: {$and:[{password: {$nin: ['']}}]}}]};
	// console.log(a1,a2,a3,a4,a5,a6,a7);

}

// export function aaa<A extends AtomName>():void{
//   // let q:Query<A> = {};
//   // q = {_id:id};
//   const qw:Query.Equal<A> = {};
//   const q:Query.Equal<A> = {_id: '', active: true} as Query.Equal<A>;
//   const r1:Query<A> = {_date: new Date(), active:true} as Query<A>;
//   const r2:Query<A> = {$and:[{$not: {_id: ''}}]} as Query<A>;
//   console.log(q,qw,r1,r2);
// }

// export const dd1:Query.Equal<'superuser'> = {active: true};
// export const dd2:Query.Equal<'media'> = {_deleted_from: ''};
// export const dd3:Query.Equal<'obi'> = {_id: ''};
// export const dd4:Query.Equal<'product'> = {title: ''};

// export const dd5:Query.Equal<'superuser'> = {_id: 'a', active: true, _deleted_from: '', _date: new Date()};
// export const dd6:Query.Equal<'media'> = {_id: 'a', active: true, _deleted_from: '', _date: new Date()};
// export const dd7:Query.Equal<'obi'> = {_id: 'a', active: true, _deleted_from: '', _date: new Date()};
// export const dd8:Query.Equal<'product'> = {_id: 'a', active: true, _deleted_from: '', _date: new Date()};

// export const r:Query<'superuser'> = {$and:[{$not: {_id: ''}}, {email:''}]};
	
