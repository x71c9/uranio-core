/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { ConnectionName } from './types';
declare const models_by_connection: Map<ConnectionName, Map<"group" | "superuser" | "user", mongoose.Model<mongoose.Document<any>>>>;
export { models_by_connection };
