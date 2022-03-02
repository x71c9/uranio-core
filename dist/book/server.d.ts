/**
 * Module for Server Book Methods
 *
 * @packageDocumentation
 */
import { Book as ClientBook } from '../typ/book_cln';
import { Book } from '../typ/book';
import { schema } from '../sch/server';
export declare function add_definition(atom_name: string, atom_definition: ClientBook.Definition): ClientBook;
export declare function add_bll_definition<A extends schema.AtomName>(atom_name: A, bll_definition: Book.Definition.Bll<A>): Book;
export declare function get_plural(atom_name: schema.AtomName): string;
export declare function get_names(): schema.AtomName[];
export declare function validate_name(atom_name: string): boolean;
export declare function get_all_definitions(): Book;
export declare function get_definition<A extends schema.AtomName>(atom_name: A): Book.Definition<A>;
export declare function get_property_definition<A extends schema.AtomName>(atom_name: A, property_name: keyof Book.Definition.Properties): Book.Definition.Property;
export declare function get_custom_properties_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function get_properties_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: string): boolean;
