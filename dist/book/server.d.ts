/**
 * Module for Server schema.Atom Book Methods
 *
 * @packageDocumentation
 */
import { Book } from '../typ/book_srv';
import { schema } from '../sch/';
export declare function add_definition(atom_name: string, atom_definition: Book.Definition): Book;
export declare function get_names(): schema.AtomName[];
export declare function validate_name(atom_name: string): boolean;
export declare function get_all_definitions(): Book;
export declare function get_definition<A extends schema.AtomName>(atom_name: A): Book.Definition;
export declare function get_property_definition<A extends schema.AtomName>(atom_name: A, property_name: keyof Book.Definition.Properties): Book.Definition.Property;
export declare function get_custom_property_definitions<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function get_all_property_definitions<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: string): boolean;
