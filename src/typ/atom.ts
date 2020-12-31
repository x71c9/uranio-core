/**
 * Atom types module
 *
 * @packageDocumentation
 */

import {core_config} from '../config/defaults';

import {atom_book} from '../book';

import {BookPropertyType, RealType} from './book';

export const atom_hard_properties = {
	_id: {
		type: BookPropertyType.ID,
		label: '_id',
	},
	_date: {
		type: BookPropertyType.TIME,
		label: '_date',
		default: 'NOW'
	}
} as const;

export const atom_common_properties = {
	_deleted_from: {
		type: BookPropertyType.ID,
		label: 'Deleted from',
		optional: true
	},
	active: {
		type: BookPropertyType.BINARY,
		label: 'Active'
	}
} as const;

export type AtomName = keyof typeof atom_book;

type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];

type KeyOfHardProperties = keyof typeof atom_hard_properties;

type KeyOfCommonProperties = keyof typeof atom_common_properties;


type PickSubType<Base, Condition> = Pick<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type OmitSubType<Base, Condition> = Omit<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type ExtractOptional<P> = PickSubType<P, {optional: true}>;

type ExcludeOptional<P> = OmitSubType<P, {optional: true}>;


type ExcludeSubAtomAndSubAtomArray<P> = OmitSubType<P, {type: BookPropertyType.ATOM} | {type: BookPropertyType.ATOM_ARRAY}>;

type ExtractSubAtom<P> = PickSubType<P, {type: BookPropertyType.ATOM}>;

type ExtractSubAtomArray<P> = PickSubType<P, {type: BookPropertyType.ATOM_ARRAY}>;


type RequiredSubAtom<P> = OmitSubType<ExtractSubAtom<P>, {optional: true}>;

type OptionalSubAtom<P> = PickSubType<ExtractSubAtom<P>, {optional: true}>;

type RequiredSubAtomArray<P> = OmitSubType<ExtractSubAtomArray<P>, {optional: true}>;

type OptionalSubAtomArray<P> = PickSubType<ExtractSubAtomArray<P>, {optional: true}>;


type OptionalPrimitive<P> = PickSubType<ExcludeSubAtomAndSubAtomArray<P>, {optional: true}>;

type RequiredPrimitive<P> = OmitSubType<ExcludeSubAtomAndSubAtomArray<P>, {optional: true}>;


type AtomDefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type AtomDefinitionPropertyInferSubType<P> =
	P extends ({type: BookPropertyType.ATOM, atom: infer I} | {type: BookPropertyType.ATOM_ARRAY, atom: infer I}) ? I : never;

type AtomTypeOfProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> =
	AtomDefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;

type RealTypeOfAtomProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> =
	AtomTypeOfProperty<A,k> extends BookPropertyType ?
		RealType<AtomTypeOfProperty<A,k>> : never;

type AtomTypeOfHardProperty<k extends KeyOfHardProperties> =
	AtomDefinitionPropertyInferType<typeof atom_hard_properties[k]>;

type AtomTypeOfCommonProperty<k extends KeyOfCommonProperties> =
	AtomDefinitionPropertyInferType<typeof atom_common_properties[k]>;

type RealTypeOfAtomHardProperty<k extends KeyOfHardProperties> =
	RealType<AtomTypeOfHardProperty<k>>;

type RealTypeOfAtomCommonProperty<k extends KeyOfCommonProperties> =
	RealType<AtomTypeOfCommonProperty<k>>;

type AtomHardProperties = {
	[k in KeyOfHardProperties]: RealTypeOfAtomHardProperty<k>
}

type OptionalKeyOfAtomProperties<A extends AtomName> =
	keyof ExtractOptional<PropertiesOfAtomDefinition<A>>;

type RequiredKeyOfAtomProperties<A extends AtomName> =
	keyof ExcludeOptional<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfAtomCommonProperties =
	keyof ExtractOptional<typeof atom_common_properties>;

type RequiredKeyOfAtomCommonProperties =
	keyof ExcludeOptional<typeof atom_common_properties>;

type RequiredKeyOfAtomPrimitiveProperties<A extends AtomName> =
	keyof RequiredPrimitive<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfAtomPrimitiveProperties<A extends AtomName> =
	keyof OptionalPrimitive<PropertiesOfAtomDefinition<A>>;

type RequiredKeyOfSubAtomProperties<A extends AtomName> =
	keyof RequiredSubAtom<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfSubAtomProperties<A extends AtomName> =
	keyof OptionalSubAtom<PropertiesOfAtomDefinition<A>>;

type RequiredKeyOfSubAtomArrayProperties<A extends AtomName> =
	keyof RequiredSubAtomArray<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfSubAtomArrayProperties<A extends AtomName> =
	keyof OptionalSubAtomArray<PropertiesOfAtomDefinition<A>>;

type CustomKeyOfAtomShape<A extends AtomName> =
	RequiredKeyOfAtomProperties<A> |
	OptionalKeyOfAtomProperties<A> |
	RequiredKeyOfAtomPrimitiveProperties<A> |
	OptionalKeyOfAtomPrimitiveProperties<A>;

type SubAtomKeyOfAtom<A extends AtomName> =
	RequiredKeyOfSubAtomProperties<A> |
	OptionalKeyOfSubAtomProperties<A> |
	RequiredKeyOfSubAtomArrayProperties<A> |
	OptionalKeyOfSubAtomArrayProperties<A>;


export type Depth = undefined | typeof core_config['max_query_depth_allowed'];

type RealSubAtomType<A extends AtomName, k extends SubAtomKeyOfAtom<A>, D extends Depth> =
	AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
	(
		D extends (undefined | 0 | 1) ? Atom<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>> :
		D extends 2 ? Molecule<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>, 1> :
		D extends 3 ? Molecule<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>, 2> :
		never
	) : never;

type RealSubAtomShapeType<A extends AtomName, k extends SubAtomKeyOfAtom<A>> =
	AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
	MoleculeShape<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>> :
	RealType<BookPropertyType.ID>;


export type AtomShape<A extends AtomName> =
	{ [k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A,k> } &
	{ [k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A,k> } &
	{ [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k> } &
	{ [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k> }

export type Atom<A extends AtomName> = AtomHardProperties & AtomShape<A>;


type MoleculePrimitive<A extends AtomName> =
	{ [k in RequiredKeyOfAtomPrimitiveProperties<A>]: RealTypeOfAtomProperty<A,k> } &
	{ [k in OptionalKeyOfAtomPrimitiveProperties<A>]?: RealTypeOfAtomProperty<A,k> } &
	{ [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k> } &
	{ [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k> };

export type MoleculeShape<A extends AtomName> =
	MoleculePrimitive<A> &
	{ [k in RequiredKeyOfSubAtomProperties<A>]: RealSubAtomShapeType<A,k> } &
	{ [k in OptionalKeyOfSubAtomProperties<A>]?: RealSubAtomShapeType<A,k> } &
	{ [k in RequiredKeyOfSubAtomArrayProperties<A>]: RealSubAtomShapeType<A,k>[] } &
	{ [k in OptionalKeyOfSubAtomArrayProperties<A>]?: RealSubAtomShapeType<A,k>[] }

export type Molecule<A extends AtomName, D extends Depth = 0> =
	D extends (0 | undefined) ? Atom<A> :
	AtomHardProperties & MoleculePrimitive<A> &
	{ [k in RequiredKeyOfSubAtomProperties<A>]: RealSubAtomType<A,k,D> } &
	{ [k in OptionalKeyOfSubAtomProperties<A>]?: RealSubAtomType<A,k,D> } &
	{ [k in RequiredKeyOfSubAtomArrayProperties<A>]: RealSubAtomType<A,k,D>[] } &
	{ [k in OptionalKeyOfSubAtomArrayProperties<A>]?: RealSubAtomType<A,k,D>[] };


export const a:Molecule<'product'> = {
	_id: '',
	_date: new Date('2020-01-01'),
	title: '',
	price: 0,
	active: true,
	cover: ['']
};

export const b:Molecule<'product',1> = {
	_id: '',
	_date: new Date('2020-01-01'),
	title: '',
	price: 0,
	active: true,
	cover: [{
		_id: '',
		_date: new Date(),
		src: '',
		type: '',
		active: false,
		superuser: '',
	}]
};

export const c:Molecule<'product',2> = {
	_id: '',
	_date: new Date('2020-01-01'),
	title: '',
	price: 0,
	active: true,
	cover: [{
		_id: '',
		_date: new Date(),
		src: '',
		type: '',
		active: false,
		superuser: {
			_id: '',
			_date: new Date(),
			active: true,
			email: '',
			password: ''
		}
	}]
};

// type RealSubAtomShapeType<A extends AtomName, k extends SubAtomKeyOfAtom<A>> =
//   AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
//   AtomShape<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>> : never;

// type RealSubAtomType<A extends AtomName, k extends SubAtomKeyOfAtom<A>> =
//   AtomHardProperties & RealSubAtomShapeType<A,k>;

// type AtomShapePrimitives<A extends AtomName> = {
//   [k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A,k>
// } & {
//   [k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A,k>
// } & {
//   [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>
// } & {
//   [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>
// } & {
//   [k in RequiredSubAtomKeyOfAtomProperties<A>]: IDTypeOfSubAtom<A,k>
// } & {
//   [k in OptionalSubAtomKeyOfAtomProperties<A>]?: IDTypeOfSubAtom<A,k>
// };

// type AtomShapeSubAtoms<A extends AtomName> = {
//   [k in RequiredSubAtomKeyOfAtomProperties<A>]: RealSubAtomShapeType<A,k>
// } & {
//   [k in OptionalSubAtomKeyOfAtomProperties<A>]?: RealSubAtomShapeType<A,k>
// };

// type AtomSubAtoms<A extends AtomName> = {
//   [k in RequiredSubAtomKeyOfAtomProperties<A>]: RealSubAtomType<A,k>
// } & {
//   [k in OptionalSubAtomKeyOfAtomProperties<A>]?: RealSubAtomType<A,k>
// };

// type AtomPrimitives<A extends AtomName> = {
//   [k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A,k>
// } & {
//   [k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A,k>
// } & {
//   [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>
// } & {
//   [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>
// };

// export type AtomShape<A extends AtomName> =
//   AtomShapePrimitives<A> &
//   AtomShapeSubAtoms<A>;

// export type AtomShape<A extends AtomName> =
//   AtomShapePrimitives<A>

// export type Atom<A extends AtomName> =
//   AtomHardProperties &
//   AtomPrimitives<A> &
//   AtomSubAtoms<A>

// export const a:Atom<'product'> = {
//   _id: '',
//   _date: new Date('2020-01-01'),
//   title: '',
//   price: 0,
//   active: true,
//   cover: {
//     _id: '',
//     _date: new Date(),
//     src: '',
//     type: '',
//     active: false,
//     superuser: {
//       _id: '',
//       _date: new Date(),
//       email: '',
//       password: '',
//       active: true
//     }
//   }
// };

// export const b:AtomShape<'product'> = {
//   title: '',
//   price: 0,
//   active: true,
//   cover: ''
// };

// export type KeyOfAtomShape<A extends AtomName> =
//   CustomKeyOfAtomShape<A> |
//   SubAtomKeyOfAtom<A>|
//   RequiredKeyOfAtomCommonProperties |
//   OptionalKeyOfAtomCommonProperties;

// export type KeyOfAtomShape<A extends AtomName> =
//   keyof AtomShape<A>;

// // KeyOfAtomShape<A> | KeyOfHardProperties | KeyOfCommonProperties;
// export type KeyOfAtom<A extends AtomName> =
//   keyof Atom<A>;


