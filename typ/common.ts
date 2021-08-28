/**
 * Common types module
 *
 * @packageDocumentation
 */

export const enum BookPropertyType {
	ID = 'ID',
	TEXT = 'TEXT',
	LONG_TEXT = 'LONG_TEXT',
	EMAIL = 'EMAIL',
	INTEGER = 'INTEGER',
	FLOAT = 'FLOAT',
	BINARY = 'BINARY',
	ENCRYPTED = 'ENCRYPTED',
	DAY = 'DAY',
	TIME = 'TIME',
	ENUM_STRING = 'ENUM_STRING',
	ENUM_NUMBER = 'ENUM_NUMBER',
	SET_STRING = 'SET_STRING',
	SET_NUMBER = 'SET_NUMBER',
	ATOM = 'ATOM',
	ATOM_ARRAY = 'ATOM_ARRAY'
}

export type RealType<AT extends BookPropertyType> =
	AT extends BookPropertyType.ID ? string :
	AT extends BookPropertyType.TEXT ? string :
	AT extends BookPropertyType.LONG_TEXT ? string :
	AT extends BookPropertyType.EMAIL ? string :
	AT extends BookPropertyType.INTEGER ? number :
	AT extends BookPropertyType.FLOAT ? number :
	AT extends BookPropertyType.BINARY ? boolean :
	AT extends BookPropertyType.ENCRYPTED ? string :
	AT extends BookPropertyType.DAY ? Date :
	AT extends BookPropertyType.TIME ? Date :
	AT extends BookPropertyType.SET_STRING ? Array<string> :
	AT extends BookPropertyType.SET_NUMBER ? Array<number> :
	AT extends BookPropertyType.ENUM_STRING ? string :
	AT extends BookPropertyType.ENUM_NUMBER ? number :
	AT extends BookPropertyType.ATOM ? string :
	AT extends BookPropertyType.ATOM_ARRAY ? string[] :
	never;


