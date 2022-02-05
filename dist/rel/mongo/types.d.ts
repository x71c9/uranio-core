/**
 * Types for Mongo Module
 *
 * @packageDocumentation
 */
import mongoose from 'mongoose';
export declare type PopulateObject = {
    path: string;
    model: string;
    match?: mongoose._FilterQuery<any>;
    populate?: PopulateObject[];
};
