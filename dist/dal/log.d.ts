/**
 * Class for Advanced Data Access Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { DAL } from './dal';
export declare class LogDAL<A extends schema.LogName> extends DAL<A> {
    constructor(log_name: A);
}
export declare function create_log<A extends schema.LogName>(log_name: A): LogDAL<A>;
