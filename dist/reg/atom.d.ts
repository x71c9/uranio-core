/**
 * Register module
 *
 * @packageDocumentation
 */
/**
 * Register Atom need to work for both server and cilent.
 * We cannot import Server property like BLL
 * Therefore we use client types Book.Definition
 */
import * as types from '../client/types';
import { schema } from '../sch/server';
export declare function atom<A extends schema.AtomName>(atom_definition: types.Book.Definition, atom_name?: A): string;
