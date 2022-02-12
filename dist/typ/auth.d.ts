/**
 * Auth types module
 *
 * @packageDocumentation
 */
import { abstract_passport } from '../stc/index';
import { PassportKey } from './intra';
declare type MapType<T> = T extends 'string' ? string : T extends 'string[]' ? string[] : T extends 'number' ? number : T extends 'number[]' ? number[] : T extends 'boolean' ? boolean : never;
export declare type Passport = {
    [k in PassportKey]: MapType<typeof abstract_passport[k]>;
};
export declare enum AuthAction {
    READ = "READ",
    WRITE = "WRITE",
    AUTH = "AUTH"
}
export {};
