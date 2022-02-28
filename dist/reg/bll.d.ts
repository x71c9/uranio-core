/**
 * Register module
 *
 * @packageDocumentation
 */
import * as types from '../server/types';
import { schema } from '../sch/server';
export declare function bll<A extends schema.AtomName>(bll_definition: types.Book.Definition.Bll<A>, atom_name?: A): string;
