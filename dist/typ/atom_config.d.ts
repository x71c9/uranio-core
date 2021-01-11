/**
 * Atom configuration types module
 *
 * @packageDocumentation
 */
export declare type AtomDefinition = {
    properties: AtomProperties;
};
export declare type AtomProperties = {
    [k: string]: AtomField;
};
declare type AtomField = AtomFieldText | AtomFieldLongText | AtomFieldEmail | AtomFieldInteger | AtomFieldFloat | AtomFieldBinary | AtomFieldEncrypted | AtomFieldTime | AtomFieldSet | AtomFieldAtom;
export declare const enum AtomFieldType {
    TEXT = "TEXT",
    LONG_TEXT = "LONG_TEXT",
    EMAIL = "EMAIL",
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BINARY = "BINARY",
    ENCRYPTED = "ENCRYPTED",
    TIME = "TIME",
    SET = "SET",
    ATOM = "ATOM"
}
interface AtomFiledShared {
    type: AtomFieldType;
    label: string;
    required?: boolean;
}
interface AtomFieldText extends AtomFiledShared {
    type: AtomFieldType.TEXT;
    validation?: AtomFieldStringValidation;
}
interface AtomFieldLongText extends AtomFiledShared {
    type: AtomFieldType.LONG_TEXT;
    validation?: AtomFieldStringValidation;
}
interface AtomFieldEmail extends AtomFiledShared {
    type: AtomFieldType.EMAIL;
}
interface AtomFieldInteger extends AtomFiledShared {
    type: AtomFieldType.INTEGER;
}
interface AtomFieldFloat extends AtomFiledShared {
    type: AtomFieldType.FLOAT;
    format?: AtomFieldFloatFormat;
}
interface AtomFieldBinary extends AtomFiledShared {
    type: AtomFieldType.BINARY;
    default?: 0 | 1;
    values?: [string, string];
}
interface AtomFieldEncrypted extends AtomFiledShared {
    type: AtomFieldType.ENCRYPTED;
    validation?: AtomFieldStringValidation;
}
interface AtomFieldTime extends AtomFiledShared {
    type: AtomFieldType.TIME;
    validation?: AtomFieldTimeValidation;
}
interface AtomFieldSet extends AtomFiledShared {
    type: AtomFieldType.SET;
    values: (string | number)[];
    validation?: AtomFieldSetValidation;
}
interface AtomFieldAtom extends AtomFiledShared {
    type: AtomFieldType.ATOM;
    atom: string;
    validation?: AtomFieldAtomValidation;
}
interface AtomFieldStringValidation {
    alphanum?: boolean;
    contain_lowercase?: boolean;
    contain_number?: boolean;
    contain_uppercase?: boolean;
    length?: number;
    letters_only?: boolean;
    lowercase?: boolean;
    max?: number;
    min?: number;
    numbers_only?: boolean;
    reg_ex?: RegExp;
    uppercase?: boolean;
}
interface AtomFieldTimeValidation {
    min?: Date;
    max?: Date;
}
interface AtomFieldSetValidation {
    min?: number;
    max?: number;
    length?: number;
}
interface AtomFieldAtomValidation {
    date_from?: Date;
    date_until?: Date;
}
interface AtomFieldFloatFormat {
    decimal?: number;
    decimal_point?: string;
    thousands_step?: string;
}
export {};
