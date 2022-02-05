/**
 * Mongo Schema generator module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
import { schema } from '../../sch/';
export declare function generate_mongo_schema_def<A extends schema.AtomName>(atom_name: A): mongoose.SchemaDefinition;
