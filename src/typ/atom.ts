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

type KeyOfPropertiesOfAtomDef<A extends AtomName> = keyof PropertiesOfAtomDefinition<A>;

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

type BondPropertyDefinition = {type: BookPropertyType.ATOM} | {type: BookPropertyType.ATOM_ARRAY};

type ExcludeBondAndBondArray<P> = OmitSubType<P, BondPropertyDefinition>;

type ExtractBonds<P> = PickSubType<P, BondPropertyDefinition>;

// type ExtractBond<P> = PickSubType<P, {type: BookPropertyType.ATOM}>;

// type ExtractBondArray<P> = PickSubType<P, {type: BookPropertyType.ATOM_ARRAY}>;

type RequiredBonds<P> = OmitSubType<ExtractBonds<P>, {optional: true}>;

type OptionalBonds<P> = PickSubType<ExtractBonds<P>, {optional: true}>;

// type RequiredBond<P> = OmitSubType<ExtractBond<P>, {optional: true}>;

// type OptionalBond<P> = PickSubType<ExtractBond<P>, {optional: true}>;

// type RequiredBondArray<P> = OmitSubType<ExtractBondArray<P>, {optional: true}>;

// type OptionalBondArray<P> = PickSubType<ExtractBondArray<P>, {optional: true}>;

type OptionalPrimitive<P> = PickSubType<ExcludeBondAndBondArray<P>, {optional: true}>;

type RequiredPrimitive<P> = OmitSubType<ExcludeBondAndBondArray<P>, {optional: true}>;


type AtomDefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type AtomDefinitionPropertyInferBondAtomName<P> =
	P extends ({type: BookPropertyType.ATOM, atom: infer I} | {type: BookPropertyType.ATOM_ARRAY, atom: infer I}) ? I : never;

type AtomDefinitionPropertyIsAtomArray<P> =
	P extends {type: BookPropertyType.ATOM_ARRAY} ? true : false;

type AtomTypeOfProperty<A extends AtomName, k extends KeyOfPropertiesOfAtomDef<A>> =
	AtomDefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;

type RealTypeOfAtomProperty<A extends AtomName, k extends KeyOfPropertiesOfAtomDef<A>> =
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

type OptionalKeyOfAtomCommonProperties =
	keyof ExtractOptional<typeof atom_common_properties>;

type RequiredKeyOfAtomCommonProperties =
	keyof ExcludeOptional<typeof atom_common_properties>;

type RequiredKeyOfAtomPrimitiveProperties<A extends AtomName> =
	keyof RequiredPrimitive<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfAtomPrimitiveProperties<A extends AtomName> =
	keyof OptionalPrimitive<PropertiesOfAtomDefinition<A>>;

type RequiredKeyOfBondsProperties<A extends AtomName> =
	keyof RequiredBonds<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfBondsProperties<A extends AtomName> =
	keyof OptionalBonds<PropertiesOfAtomDefinition<A>>;

// type RequiredKeyOfBondProperties<A extends AtomName> =
//   keyof RequiredBond<PropertiesOfAtomDefinition<A>>;

// type OptionalKeyOfBondProperties<A extends AtomName> =
//   keyof OptionalBond<PropertiesOfAtomDefinition<A>>;

// type RequiredKeyOfBondArrayProperties<A extends AtomName> =
//   keyof RequiredBondArray<PropertiesOfAtomDefinition<A>>;

// type OptionalKeyOfBondArrayProperties<A extends AtomName> =
//   keyof OptionalBondArray<PropertiesOfAtomDefinition<A>>;


export type Depth = undefined | typeof core_config['max_query_depth_allowed'];

type RealBondType<A extends AtomName, k extends KeyOfPropertiesOfAtomDef<A>, D extends Depth> =
	AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
	(
		D extends (undefined | 0) ?
			Atom<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>> :
		D extends 1 ? (
			AtomDefinitionPropertyIsAtomArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>[] :
				Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>
		) :
		D extends 2 ? (
			AtomDefinitionPropertyIsAtomArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>[] :
				Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>
		) :
		D extends 3 ? (
			AtomDefinitionPropertyIsAtomArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
			Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>[] :
			Molecule<AtomDefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>
		) :
		never
	) : never;

type AtomPrimitiveShape<A extends AtomName> =
	{ [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k> } &
	{ [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k> } &
	{ [k in RequiredKeyOfAtomPrimitiveProperties<A>]: RealTypeOfAtomProperty<A,k> } &
	{ [k in OptionalKeyOfAtomPrimitiveProperties<A>]?: RealTypeOfAtomProperty<A,k> };

type AtomOrMolecule = 'atom' | 'molecule';

export type AtomMoleculeBondPropertyType<A extends AtomName, AoM extends AtomOrMolecule, k extends KeyOfPropertiesOfAtomDef<A>, D extends Depth> =
	AoM extends 'molecule' ? RealBondType<A,k,D> :
	AoM extends 'atom' ? RealTypeOfAtomProperty<A,k> :
	never;

export type BondShape<A extends AtomName, AoM extends AtomOrMolecule, D extends Depth> =
	{ [k in RequiredKeyOfBondsProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	{ [k in OptionalKeyOfBondsProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };
	// { [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	// { [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in RequiredKeyOfBondArrayProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in OptionalKeyOfBondArrayProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };

export type AtomShape<A extends AtomName> =
	AtomPrimitiveShape<A> & BondShape<A, 'atom', 0>;


export type Atom<A extends AtomName> = AtomHardProperties & AtomShape<A>;

export type Molecule<A extends AtomName, D extends Depth = 0> =
	D extends (0 | undefined) ? Atom<A> :
	AtomHardProperties & AtomPrimitiveShape<A> &
	BondShape<A, 'molecule', D>


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

