/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { atom_book } from '../atom_book';
import { Passport } from '../typ/auth';
import { BLL } from './bll';
export declare type BLLInstance = InstanceType<typeof BLL>;
export declare function create<A extends schema.AtomName>(atom_name: A, passport?: Passport): CustomBLL<A>;
declare type BllReturnType<T, A extends schema.AtomName> = T extends (...args: any) => BLL<A> ? ReturnType<T> : BLL<A>;
declare type CustomBLL<A extends schema.AtomName> = A extends keyof typeof atom_book ? 'bll' extends keyof typeof atom_book[A] ? BllReturnType<typeof atom_book[A]['bll'], A> : BLL<A> : BLL<A>;
export {};
