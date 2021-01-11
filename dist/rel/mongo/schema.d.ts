/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { AtomName } from '../../types';
export declare function generate_mongo_schema_def<A extends AtomName>(atom_name: A): mongoose.SchemaDefinition;
