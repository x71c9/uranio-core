/**
 * Atom types module
 *
 * @packageDocumentation
 */

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

type ExcludeSubAtom<P> = OmitSubType<P, {type: BookPropertyType.ATOM}>;

type ExtractSubAtom<P> = PickSubType<P, {type: BookPropertyType.ATOM}>;

type RequiredSubAtom<P> = OmitSubType<ExtractSubAtom<P>, {optional: true}>;

type OptionalSubAtom<P> = PickSubType<ExtractSubAtom<P>, {optional: true}>;


type ExtractOptional<P> = PickSubType<ExcludeSubAtom<P>, {optional: true}>;

type ExcludeOptional<P> = OmitSubType<ExcludeSubAtom<P>, {optional: true}>;


type AtomDefinitionPropertyInferType<P> = P extends {type: infer I} ? I : never;

type AtomDefinitionPropertyInferSubType<P> = P extends {type: BookPropertyType.ATOM, atom: infer I} ? I : never;


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

type OptionalSubAtomKeyOfAtomProperties<A extends AtomName> =
	keyof OptionalSubAtom<PropertiesOfAtomDefinition<A>>;

type RequiredSubAtomKeyOfAtomProperties<A extends AtomName> =
	keyof RequiredSubAtom<PropertiesOfAtomDefinition<A>>;


type CustomKeyOfAtomShape<A extends AtomName> =
	RequiredKeyOfAtomProperties<A> |
	OptionalKeyOfAtomProperties<A>

type SubAtomKeyOfAtomShape<A extends AtomName> =
	RequiredSubAtomKeyOfAtomProperties<A> |
	OptionalSubAtomKeyOfAtomProperties<A>;


type RealSubAtomShapeType<A extends AtomName, k extends SubAtomKeyOfAtomShape<A>> =
	AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]> extends AtomName ?
	AtomShape<AtomDefinitionPropertyInferSubType<PropertiesOfAtomDefinition<A>[k]>> : never;

type RealSubAtomType<A extends AtomName, k extends SubAtomKeyOfAtomShape<A>> =
	AtomHardProperties & RealSubAtomShapeType<A,k>;

type AtomShapePrimitives<A extends AtomName> = {
	[k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A,k>
} & {
	[k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A,k>
} & {
	[k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>
} & {
	[k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>
};

type AtomShapeSubAtoms<A extends AtomName> = {
	[k in RequiredSubAtomKeyOfAtomProperties<A>]: RealSubAtomShapeType<A,k>
} & {
	[k in OptionalSubAtomKeyOfAtomProperties<A>]?: RealSubAtomShapeType<A,k>
};

type AtomSubAtoms<A extends AtomName> = {
	[k in RequiredSubAtomKeyOfAtomProperties<A>]: RealSubAtomType<A,k>
} & {
	[k in OptionalSubAtomKeyOfAtomProperties<A>]?: RealSubAtomType<A,k>
};

export type AtomShape<A extends AtomName> =
	AtomShapePrimitives<A> &
	AtomShapeSubAtoms<A>;

export type Atom<A extends AtomName> =
	AtomHardProperties &
	AtomShapePrimitives<A> &
	AtomSubAtoms<A>

export const a:Atom<'product'> = {
	_date: new Date('2020-01-01'),
	title: '',
	price: 0,
	active: true,
	cover: {
		_date: new Date(),
		src: '',
		type: '',
		active: false,
		superuser: {
			_id: '',
			_date: new Date(),
			email: '',
			password: '',
			active: true
		}
	}
};

// export const b:AtomShape<'product'> = {
//   title: '',
//   price: 0,
//   active: true,
//   cover: {
//     src: '',
//     type: '',
//     active: false
//   }
// };

// export type KeyOfAtomShape<A extends AtomName> =
//   CustomKeyOfAtomShape<A> |
//   SubAtomKeyOfAtomShape<A>|
//   RequiredKeyOfAtomCommonProperties |
//   OptionalKeyOfAtomCommonProperties;

// export type KeyOfAtomShape<A extends AtomName> =
//   keyof AtomShape<A>;

// // KeyOfAtomShape<A> | KeyOfHardProperties | KeyOfCommonProperties;
// export type KeyOfAtom<A extends AtomName> =
//   keyof Atom<A>;


