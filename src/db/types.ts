/**
 * Types for DB module
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

export class Schema extends mongoose.Schema{}

export interface SchemaDefinition extends mongoose.SchemaDefinition{}
