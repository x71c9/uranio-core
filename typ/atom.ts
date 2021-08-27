/**
 * Atom types module
 *
 * This modules defines all the types for an Atom starting from the `atom_book`
 * variable, defined in `urn_book`.
 *
 * An `Atom` type is composed by
 * - `atom_hard_properties`:
 *   the common properties that are generated when saved to the db: _id, _date
 * - `atom_common_properties`
 *   the common properties for each Atom
 * - and the properties defined in the `atom_book` under `properties`.
 *
 * An `AtomShape` is an `Atom` without the `atom_hard_properties`.
 *
 * A `Molecule` is an `Atom` with all its Atom-type-properties populated with
 * other Atoms.
 *
 * @packageDocumentation
 */

import {atom_book} from 'uranio-books-client/atom';

import {BookPropertyType, RealType} from './common';

import {
	atom_hard_properties,
	atom_common_properties
} from '../stc/';

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


type ExtractLogAtom<P> = PickSubType<P, {connection: 'log'}>;

export type LogName = keyof ExtractLogAtom<typeof atom_book>;

type ExtractAuthName<P> = PickSubType<P, {dock: {auth: string}}>;

export type AuthName = keyof ExtractAuthName<typeof atom_book>;

type ExtractOptional<P> = PickSubType<P, {optional: true}>;

type ExcludeOptional<P> = OmitSubType<P, {optional: true}>;

type BondPropertyDefinition = {type: BookPropertyType.ATOM} | {type: BookPropertyType.ATOM_ARRAY};

type ExcludeBondAndBondArray<P> = OmitSubType<P, BondPropertyDefinition>;

type ExtractBond<P> = PickSubType<P, BondPropertyDefinition>;

type RequiredBond<P> = OmitSubType<ExtractBond<P>, {optional: true}>;

type OptionalBond<P> = PickSubType<ExtractBond<P>, {optional: true}>;

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

// type HiddenKeyOfAtomPrimitiveProperties<A extends AtomName> =
//   keyof HiddenPrimitive<PropertiesOfAtomDefinition<A>>;

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

export type Depth = undefined | 0 | 1 | 2 | 3;

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

// type AtomPrivacyPrimitiveShape<A extends AtomName> =
//   { [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k> } &
//   { [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k> } &
//   { [k in RequiredKeyOfAtomPrimitiveProperties<A>]: RealTypeOfAtomProperty<A,k> } &
//   { [k in OptionalKeyOfAtomPrimitiveProperties<A> | HiddenKeyOfAtomPrimitiveProperties<A>]?: RealTypeOfAtomProperty<A,k> };

export type AtomMoleculeBondPropertyType<
	A extends AtomName,
	AoM extends AtomOrMolecule,
	k extends KeyOfPropertyOfAtomDefinition<A>,
	D extends Depth
> =
	AoM extends 'molecule' ? RealTypeOfMoleculeBondProperty<A,k,D> :
	AoM extends 'atom' ? RealTypeOfAtomProperty<A,k> :
	never;

type BondShape<A extends AtomName, AoM extends AtomOrMolecule, D extends Depth> =
	{ [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	{ [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };
	// { [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k ,D> } &
	// { [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in RequiredKeyOfBondArrayProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k, D> } &
	// { [k in OptionalKeyOfBondArrayProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D> };

export type AtomShape<A extends AtomName> =
	AtomPrimitiveShape<A> &
	BondShape<A, 'atom', 0>;

export type AuthAtomShape<A extends AuthName> =
	AtomPrimitiveShape<A> &
	BondShape<A, 'atom', 0> &
	{email: string, password: string, groups: string[]};

// export type AtomPrivacyShape<A extends AtomName> =
//   AtomPrivacyPrimitiveShape<A> &
//   BondShape<A, 'atom', 0>

export type Atom<A extends AtomName> =
	AtomHardProperties &
	AtomShape<A>;

export type AuthAtom<A extends AuthName> =
	AtomHardProperties &
	AuthAtomShape<A>;

// export type AtomPrivacy<A extends AtomName> =
//   AtomHardProperties &
//   AtomPrivacyShape<A>;

export type Molecule<A extends AtomName, D extends Depth = 0> =
	D extends (0 | undefined) ? Atom<A> :
	AtomHardProperties &
	AtomPrimitiveShape<A> &
	BondShape<A, 'molecule', D>

// export type MoleculePrivacy<A extends AtomName, D extends Depth = 0> =
//   D extends (0 | undefined) ? Atom<A> :
//   AtomHardProperties &
//   AtomPrivacyPrimitiveShape<A> &


