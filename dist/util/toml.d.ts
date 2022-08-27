/**
 * Read TOML module
 *
 * @packageDocumentation
 */
import { Configuration } from '../srv/types';
/**
 * Read `uranio.toml` file. It also populate "dev_" config keys.
 *
 * @param default_repo_config The default configuration object of the current repo
 */
export declare function read(default_repo_config: Partial<Configuration>): Partial<Configuration>;
