/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
import { Passport, AuthAction } from '../typ/auth';
declare class AuthenticationBLL<A extends schema.AuthName> {
    private _atom_name;
    private _basic_bll;
    constructor(_atom_name: A);
    get_passport(token: string): Promise<Passport>;
    authenticate(email: string, password: string): Promise<string>;
    private _generate_passport;
    private _generate_token;
}
export declare type AuthenticationBLLInstance = InstanceType<typeof AuthenticationBLL>;
export declare function create<A extends schema.AuthName>(atom_name: A): AuthenticationBLL<A>;
export declare function is_public_request<A extends schema.AtomName>(atom_name: A, action: AuthAction): boolean;
export declare function is_valid_passport(passport: Passport): true;
export declare function is_superuser(passport?: Passport): boolean;
export {};
