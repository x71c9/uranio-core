/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import { schema } from '../sch/index';
import { AuthBLL } from './auth';
export declare class BLL<A extends schema.AtomName> extends AuthBLL<A> {
}
/**
 * Class @decorator function for loggin constructor with arguments
 *
 * @param log_instance - the log instance that will be used for logging
 */
