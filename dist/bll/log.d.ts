/**
 * Abstract Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/';
import { BasicBLL } from './basic';
declare class LogBLL<A extends schema.LogName> extends BasicBLL<A> {
    constructor(log_name: A);
}
export declare function create<A extends schema.LogName>(log_name: A): LogBLL<A>;
export {};
