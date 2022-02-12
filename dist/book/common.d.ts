/**
 * Common module for schema.Atom Book Methods
 *
 * Since type Book is different between Server and Client we need two different
 * module with methods with different return types.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
import { Book } from '../typ/book_cln';
export declare function validate_name(atom_name: string): atom_name is schema.AtomName;
export declare function validate_auth_name(auth_name: string): auth_name is schema.AuthName;
export declare function get_all_definitions(): Book;
export declare function get_definition<A extends schema.AtomName>(atom_name: A): Book.Definition;
export declare function get_property_definition<A extends schema.AtomName>(atom_name: A, property_name: keyof Book.Definition.Properties): Book.Definition.Property;
export declare function get_custom_property_definitions<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function get_all_property_definitions<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: string): boolean;
