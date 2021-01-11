/**
 * Class for Authentication Business Logic Layer
 *
 * @packageDocumentation
 */
import { BasicBLL } from './basic';
declare class AuthBLL extends BasicBLL<'user'> {
    constructor();
    authenticate(email: string, password: string): Promise<string>;
}
export declare function create_users(): AuthBLL;
export {};
