/**
 * Atom types module
 *
 * @packageDocumentation
 */

import {atom_book} from '@book';

import {core_config} from '../conf/defaults';

import {BookPropertyType, RealType} from './book';

export const atom_hard_properties = {
	_id: {
		type: BookPropertyType.ID,
		label: '_id',
	},
	_date: {
		type: BookPropertyType.TIME,
		label: '_date',
		default: 'NOW',
		on_error: () => {return new Date();}
	}
} as const;

export const atom_common_properties = {
	_r:{
		type: BookPropertyType.ID,
		label: '_r',
		optional: true
	},
	_w:{
		type: BookPropertyType.ID,
		label: '_w',
		optional: true
	},
	_deleted_from: {
		type: BookPropertyType.ID,
		label: 'Deleted from',
		optional: true
	},
	active: {
		type: BookPropertyType.BINARY,
		default: true,
		label: 'Active'
	}
} as const;

export type AtomName = keyof typeof atom_book;

type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];

export type KeyOfPropertyOfAtomDefinition<A extends AtomName> = keyof PropertiesOfAtomDefinition<A>;

export type KeyOfHardProperties = keyof typeof atom_hard_properties;

export type KeyOfCommonProperties = keyof typeof atom_common_properties;


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

type ExtractBond<P> = PickSubType<P, BondPropertyDefinition>;

// type ExtractBond<P> = PickSubType<P, {type: BookPropertyType.ATOM}>;

// type ExtractBondArray<P> = PickSubType<P, {type: BookPropertyType.ATOM_ARRAY}>;

type RequiredBond<P> = OmitSubType<ExtractBond<P>, {optional: true}>;

type OptionalBond<P> = PickSubType<ExtractBond<P>, {optional: true}>;

// type RequiredBond<P> = OmitSubType<ExtractBond<P>, {optional: true}>;

// type OptionalBond<P> = PickSubType<ExtractBond<P>, {optional: true}>;

// type RequiredBondArray<P> = OmitSubType<ExtractBondArray<P>, {optional: true}>;

// type OptionalBondArray<P> = PickSubType<ExtractBondArray<P>, {optional: true}>;

type OptionalPrimitive<P> = PickSubType<ExcludeBondAndBondArray<P>, {optional: true}>;

type RequiredPrimitive<P> = OmitSubType<ExcludeBondAndBondArray<P>, {optional: true}>;


type DefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type DefinitionPropertyInferBondAtomName<P> =
	P extends ({type: BookPropertyType.ATOM, atom: infer I} | {type: BookPropertyType.ATOM_ARRAY, atom: infer I}) ? I : never;

type DefinitionPropertyIsBondArray<P> =
	P extends {type: BookPropertyType.ATOM_ARRAY} ? true : false;

type DefinitionTypeOfDefintionProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>> =
	DefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;

export type RealTypeOfAtomProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>> =
	DefinitionTypeOfDefintionProperty<A,k> extends BookPropertyType ?
		RealType<DefinitionTypeOfDefintionProperty<A,k>> : never;

type DefinitionTypeOfHardProperty<k extends KeyOfHardProperties> =
	DefinitionPropertyInferType<typeof atom_hard_properties[k]>;

type DefinitionTypeOfCommonProperty<k extends KeyOfCommonProperties> =
	DefinitionPropertyInferType<typeof atom_common_properties[k]>;

export type RealTypeOfAtomHardProperty<k extends KeyOfHardProperties> =
	RealType<DefinitionTypeOfHardProperty<k>>;

export type RealTypeOfAtomCommonProperty<k extends KeyOfCommonProperties> =
	RealType<DefinitionTypeOfCommonProperty<k>>;

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

type RequiredKeyOfBondProperties<A extends AtomName> =
	keyof RequiredBond<PropertiesOfAtomDefinition<A>>;

type OptionalKeyOfBondProperties<A extends AtomName> =
	keyof OptionalBond<PropertiesOfAtomDefinition<A>>;

// type RequiredKeyOfBondProperties<A extends AtomName> =
//   keyof RequiredBond<PropertiesOfAtomDefinition<A>>;

// type OptionalKeyOfBondProperties<A extends AtomName> =
//   keyof OptionalBond<PropertiesOfAtomDefinition<A>>;

// type RequiredKeyOfBondArrayProperties<A extends AtomName> =
//   keyof RequiredBondArray<PropertiesOfAtomDefinition<A>>;

// type OptionalKeyOfBondArrayProperties<A extends AtomName> =
//   keyof OptionalBondArray<PropertiesOfAtomDefinition<A>>;


export type Depth = undefined | typeof core_config['max_query_depth_allowed'];

type AtomOrMolecule = 'atom' | 'molecule';

type RealTypeOfMoleculeBondProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>, D extends Depth> =
	DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
	(
		D extends (undefined | 0) ?
			Atom<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>> :
		D extends 1 ? (
			DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>[] :
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>
		) :
		D extends 2 ? (
			DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>[] :
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>
		) :
		D extends 3 ? (
			DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>[] :
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>
		) :
		D extends 4 ? (
			DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ?
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 3>[] :
				Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 3>
		) :
		never
	) : never;

type AtomPrimitiveShape<A extends AtomName> =
	{ [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k> } &
	{ [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k> } &
	{ [k in RequiredKeyOfAtomPrimitiveProperties<A>]: RealTypeOfAtomProperty<A,k> } &
	{ [k in OptionalKeyOfAtomPrimitiveProperties<A>]?: RealTypeOfAtomProperty<A,k> };

export type AtomMoleculeBondPropertyType<
	A extends AtomName,
	AoM extends AtomOrMolecule,
	k extends KeyOfPropertyOfAtomDefinition<A>,
	D extends Depth
> =
	AoM extends 'molecule' ? RealTypeOfMoleculeBondProperty<A,k,D> :
	AoM extends 'atom' ? RealTypeOfAtomProperty<A,k> :
	never;

export type BondShape<A extends AtomName, AoM extends AtomOrMolecule, D extends Depth> =
	{ [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	{ [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };
	// { [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	// { [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in RequiredKeyOfBondArrayProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in OptionalKeyOfBondArrayProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };

export type AtomShape<A extends AtomName> =
	AtomPrimitiveShape<A> &
	BondShape<A, 'atom', 0>;

export type Atom<A extends AtomName> =
	AtomHardProperties &
	AtomShape<A>;

export type Molecule<A extends AtomName, D extends Depth = 0> =
	D extends (0 | undefined) ? Atom<A> :
	AtomHardProperties &
	AtomPrimitiveShape<A> &
	BondShape<A, 'molecule', D>

