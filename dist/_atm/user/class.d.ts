/**
 * Module for Atom User class
 *
 * @packageDocumentation
 */
import { Atom } from '../abstract';
import { models, TokenObject } from '../types';
export declare const user_keys: models.ModelKeysCategories<models.User>;
/**
 * Class for Atom User
 */
export declare class User extends Atom<models.User> implements models.User {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    type: string;
    active: boolean;
    password: string;
    constructor(user: models.User);
    get_keys(): models.ModelKeysCategories<models.User>;
    get name(): string;
    get_token_object(): TokenObject;
}
