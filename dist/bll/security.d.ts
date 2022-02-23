/**
 * Security Class for Business Logic Layer
 *
 * This is a Business Logic Layer that force the use of a passport in
 * order to initialise.
 *
 * It uses an Access Control Layer (ACL) instead of a Data Access Layer (DAL).
 *
 * If the passport is a superuser it uses a DAL.
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { Passport } from '../typ/auth';
import { BasicBLL } from './basic';
export declare class SecurityBLL<A extends schema.AtomName> extends BasicBLL<A> {
    constructor(atom_name: A, _passport?: Passport);
}
export declare function create_security<A extends schema.AtomName>(atom_name: A, passport?: Passport): SecurityBLL<A>;
