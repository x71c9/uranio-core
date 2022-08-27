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
import * as types from '../cln/types';
export declare function atom(atom_definition: types.Book.Definition, atom_name?: string): string;
