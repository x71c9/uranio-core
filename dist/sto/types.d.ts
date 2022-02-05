/**
 * Types for Storage module
 *
 * @packageDocumentation
 */
/// <reference types="node" />
export interface Storage {
    upload(filename: string, buffer: Buffer | ArrayBuffer | Blob, params?: Partial<UploadParams>): Promise<string>;
    presigned(filename: string, params?: Partial<UploadParams>): Promise<string>;
    exists(filename: string): Promise<boolean>;
    base_url: string;
}
export declare type UploadParams = {
    content_type: string;
    content_length: number;
};
