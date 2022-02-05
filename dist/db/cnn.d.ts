/**
 * DB Connection methods module
 *
 * @packageDocumentation
 */
import { ConnectionName } from "../typ/book_cln";
export declare function connect(): void;
export declare function disconnect(connection_name?: ConnectionName): Promise<void>;
