/**
 * Atom User module
 *
 * @packageDocumentation
 */
import { models, AtomModule, AtomCreateFunction } from '../types';
import { User } from './class';
export declare type UserInstance = InstanceType<typeof User>;
export declare const create: AtomCreateFunction<models.User, UserInstance>;
export declare const module: AtomModule<models.User, User>;
