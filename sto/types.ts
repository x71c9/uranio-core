/**
 * Types for Storage module
 *
 * @packageDocumentation
 */

// import {
//   AtomShape,
// } from '../typ/atom';

export interface Storage {
	
	upload(filename:string, buffer:Buffer | ArrayBuffer | Blob, params?:Partial<UploadParams>)
			:Promise<string>;
	
	exists(filename:string):Promise<boolean>
	
}

export type UploadParams = {
	content_type: string
	content_length: number
}
