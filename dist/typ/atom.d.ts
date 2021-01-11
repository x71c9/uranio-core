/**
 * Atom types module
 *
 * @packageDocumentation
 */
import { core_config } from '../conf/defaults';
import { atom_book } from '../book';
import { BookPropertyType, RealType } from './book';
export declare const atom_hard_properties: {
    readonly _id: {
        readonly type: BookPropertyType.ID;
        readonly label: "_id";
    };
    readonly _date: {
        readonly type: BookPropertyType.TIME;
        readonly label: "_date";
        readonly default: "NOW";
        readonly on_error: () => Date;
    };
};
export declare const atom_common_properties: {
    readonly _r: {
        readonly type: BookPropertyType.ID;
        readonly label: "_r";
        readonly optional: true;
    };
    readonly _w: {
        readonly type: BookPropertyType.ID;
        readonly label: "_w";
        readonly optional: true;
    };
    readonly _deleted_from: {
        readonly type: BookPropertyType.ID;
        readonly label: "Deleted from";
        readonly optional: true;
    };
    readonly active: {
        readonly type: BookPropertyType.BINARY;
        readonly default: true;
        readonly label: "Active";
    };
};
export declare type AtomName = keyof typeof atom_book;
declare type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];
export declare type KeyOfPropertyOfAtomDefinition<A extends AtomName> = keyof PropertiesOfAtomDefinition<A>;
export declare type KeyOfHardProperties = keyof typeof atom_hard_properties;
export declare type KeyOfCommonProperties = keyof typeof atom_common_properties;
declare type PickSubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;
declare type OmitSubType<Base, Condition> = Omit<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;
declare type ExtractOptional<P> = PickSubType<P, {
    optional: true;
}>;
declare type ExcludeOptional<P> = OmitSubType<P, {
    optional: true;
}>;
declare type BondPropertyDefinition = {
    type: BookPropertyType.ATOM;
} | {
    type: BookPropertyType.ATOM_ARRAY;
};
declare type ExcludeBondAndBondArray<P> = OmitSubType<P, BondPropertyDefinition>;
declare type ExtractBond<P> = PickSubType<P, BondPropertyDefinition>;
declare type RequiredBond<P> = OmitSubType<ExtractBond<P>, {
    optional: true;
}>;
declare type OptionalBond<P> = PickSubType<ExtractBond<P>, {
    optional: true;
}>;
declare type OptionalPrimitive<P> = PickSubType<ExcludeBondAndBondArray<P>, {
    optional: true;
}>;
declare type RequiredPrimitive<P> = OmitSubType<ExcludeBondAndBondArray<P>, {
    optional: true;
}>;
declare type DefinitionPropertyInferType<P> = P extends {
    type: infer I;
} ? I : never;
declare type DefinitionPropertyInferBondAtomName<P> = P extends ({
    type: BookPropertyType.ATOM;
    atom: infer I;
} | {
    type: BookPropertyType.ATOM_ARRAY;
    atom: infer I;
}) ? I : never;
declare type DefinitionPropertyIsBondArray<P> = P extends {
    type: BookPropertyType.ATOM_ARRAY;
} ? true : false;
declare type DefinitionTypeOfDefintionProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>> = DefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;
export declare type RealTypeOfAtomProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>> = DefinitionTypeOfDefintionProperty<A, k> extends BookPropertyType ? RealType<DefinitionTypeOfDefintionProperty<A, k>> : never;
declare type DefinitionTypeOfHardProperty<k extends KeyOfHardProperties> = DefinitionPropertyInferType<typeof atom_hard_properties[k]>;
declare type DefinitionTypeOfCommonProperty<k extends KeyOfCommonProperties> = DefinitionPropertyInferType<typeof atom_common_properties[k]>;
export declare type RealTypeOfAtomHardProperty<k extends KeyOfHardProperties> = RealType<DefinitionTypeOfHardProperty<k>>;
export declare type RealTypeOfAtomCommonProperty<k extends KeyOfCommonProperties> = RealType<DefinitionTypeOfCommonProperty<k>>;
declare type AtomHardProperties = {
    [k in KeyOfHardProperties]: RealTypeOfAtomHardProperty<k>;
};
declare type OptionalKeyOfAtomCommonProperties = keyof ExtractOptional<typeof atom_common_properties>;
declare type RequiredKeyOfAtomCommonProperties = keyof ExcludeOptional<typeof atom_common_properties>;
declare type RequiredKeyOfAtomPrimitiveProperties<A extends AtomName> = keyof RequiredPrimitive<PropertiesOfAtomDefinition<A>>;
declare type OptionalKeyOfAtomPrimitiveProperties<A extends AtomName> = keyof OptionalPrimitive<PropertiesOfAtomDefinition<A>>;
declare type RequiredKeyOfBondProperties<A extends AtomName> = keyof RequiredBond<PropertiesOfAtomDefinition<A>>;
declare type OptionalKeyOfBondProperties<A extends AtomName> = keyof OptionalBond<PropertiesOfAtomDefinition<A>>;
export declare type Depth = undefined | typeof core_config['max_query_depth_allowed'];
declare type AtomOrMolecule = 'atom' | 'molecule';
declare type RealTypeOfMoleculeBondProperty<A extends AtomName, k extends KeyOfPropertyOfAtomDefinition<A>, D extends Depth> = DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]> extends AtomName ? (D extends (undefined | 0) ? Atom<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>> : D extends 1 ? (DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ? Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>[] : Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 0>) : D extends 2 ? (DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ? Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>[] : Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 1>) : D extends 3 ? (DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ? Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>[] : Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 2>) : D extends 4 ? (DefinitionPropertyIsBondArray<PropertiesOfAtomDefinition<A>[k]> extends true ? Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 3>[] : Molecule<DefinitionPropertyInferBondAtomName<PropertiesOfAtomDefinition<A>[k]>, 3>) : never) : never;
declare type AtomPrimitiveShape<A extends AtomName> = {
    [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>;
} & {
    [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>;
} & {
    [k in RequiredKeyOfAtomPrimitiveProperties<A>]: RealTypeOfAtomProperty<A, k>;
} & {
    [k in OptionalKeyOfAtomPrimitiveProperties<A>]?: RealTypeOfAtomProperty<A, k>;
};
export declare type AtomMoleculeBondPropertyType<A extends AtomName, AoM extends AtomOrMolecule, k extends KeyOfPropertyOfAtomDefinition<A>, D extends Depth> = AoM extends 'molecule' ? RealTypeOfMoleculeBondProperty<A, k, D> : AoM extends 'atom' ? RealTypeOfAtomProperty<A, k> : never;
export declare type BondShape<A extends AtomName, AoM extends AtomOrMolecule, D extends Depth> = {
    [k in RequiredKeyOfBondProperties<A>]: AtomMoleculeBondPropertyType<A, AoM, k, D>;
} & {
    [k in OptionalKeyOfBondProperties<A>]?: AtomMoleculeBondPropertyType<A, AoM, k, D>;
};
export declare type AtomShape<A extends AtomName> = AtomPrimitiveShape<A> & BondShape<A, 'atom', 0>;
export declare type Atom<A extends AtomName> = AtomHardProperties & AtomShape<A>;
export declare type Molecule<A extends AtomName, D extends Depth = 0> = D extends (0 | undefined) ? Atom<A> : AtomHardProperties & AtomPrimitiveShape<A> & BondShape<A, 'molecule', D>;
export {};
