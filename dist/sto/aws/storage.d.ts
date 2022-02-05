/**
 * AWS Storage module
 *
 * @packageDocumentation
 */
/// <reference types="node" />
import AWS from 'aws-sdk';
import { Storage, UploadParams } from '../types';
/**
 * AWS Storage class
 */
declare class AWSStorage implements Storage {
    protected s3: AWS.S3;
    base_url: string;
    constructor();
    upload(filepath: string, buffer: ArrayBuffer | Buffer | Blob, params?: Partial<UploadParams>): Promise<string>;
    presigned(filepath: string, params?: Partial<UploadParams>): Promise<string>;
    exists(filepath: string): Promise<boolean>;
}
export declare function create(): AWSStorage;
export {};
