/**
 * Atom types module
 *
 * @packageDocumentation
 */
import { atom_book } from '../book';
import { Book, BookPropertyType } from './book';
export declare const atom_hard_properties: {
    readonly _id: {
        readonly type: BookPropertyType.ID;
        readonly label: "_id";
    };
    readonly _date: {
        readonly type: BookPropertyType.TIME;
        readonly label: "_date";
        readonly default: "NOW";
    };
};
export declare const atom_common_properties: {
    readonly _deleted_from: {
        readonly type: BookPropertyType.ID;
        readonly label: "Deleted from";
        readonly optional: true;
    };
    readonly active: {
        readonly type: BookPropertyType.BINARY;
        readonly label: "Active";
    };
};
export declare type AtomName = keyof typeof atom_book;
declare type PropertiesOfAtomDefinition<A extends AtomName> = typeof atom_book[A]['properties'];
declare type KeyOfHardProperties = keyof typeof atom_hard_properties;
declare type KeyOfCommonProperties = keyof typeof atom_common_properties;
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
declare type AtomDefinitionPropertyInferType<P> = P extends {
    type: infer I;
} ? I : never;
declare type AtomTypeOfProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> = AtomDefinitionPropertyInferType<PropertiesOfAtomDefinition<A>[k]>;
declare type RealTypeOfAtomProperty<A extends AtomName, k extends CustomKeyOfAtomShape<A>> = AtomTypeOfProperty<A, k> extends BookPropertyType ? Book.Definition.Property.RealType<AtomTypeOfProperty<A, k>> : never;
declare type AtomTypeOfHardProperty<k extends KeyOfHardProperties> = AtomDefinitionPropertyInferType<typeof atom_hard_properties[k]>;
declare type AtomTypeOfCommonProperty<k extends KeyOfCommonProperties> = AtomDefinitionPropertyInferType<typeof atom_common_properties[k]>;
declare type RealTypeOfAtomHardProperty<k extends KeyOfHardProperties> = Book.Definition.Property.RealType<AtomTypeOfHardProperty<k>>;
declare type RealTypeOfAtomCommonProperty<k extends KeyOfCommonProperties> = Book.Definition.Property.RealType<AtomTypeOfCommonProperty<k>>;
declare type AtomHardProperties = {
    [k in KeyOfHardProperties]: RealTypeOfAtomHardProperty<k>;
};
declare type OptionalKeyOfAtomProperties<A extends AtomName> = keyof ExtractOptional<PropertiesOfAtomDefinition<A>>;
declare type RequiredKeyOfAtomProperties<A extends AtomName> = keyof ExcludeOptional<PropertiesOfAtomDefinition<A>>;
declare type OptionalKeyOfAtomCommonProperties = keyof ExtractOptional<typeof atom_common_properties>;
declare type RequiredKeyOfAtomCommonProperties = keyof ExcludeOptional<typeof atom_common_properties>;
declare type CustomKeyOfAtomShape<A extends AtomName> = RequiredKeyOfAtomProperties<A> | OptionalKeyOfAtomProperties<A>;
export declare type KeyOfAtomShape<A extends AtomName> = CustomKeyOfAtomShape<A> | RequiredKeyOfAtomCommonProperties | OptionalKeyOfAtomCommonProperties;
export declare type AtomShape<A extends AtomName> = {
    [k in RequiredKeyOfAtomProperties<A>]: RealTypeOfAtomProperty<A, k>;
} & {
    [k in OptionalKeyOfAtomProperties<A>]?: RealTypeOfAtomProperty<A, k>;
} & {
    [k in RequiredKeyOfAtomCommonProperties]: RealTypeOfAtomCommonProperty<k>;
} & {
    [k in OptionalKeyOfAtomCommonProperties]?: RealTypeOfAtomCommonProperty<k>;
};
export declare type KeyOfAtom<A extends AtomName> = KeyOfAtomShape<A> | KeyOfHardProperties | KeyOfCommonProperties;
export declare type Atom<A extends AtomName> = AtomHardProperties & AtomShape<A>;
export {};
