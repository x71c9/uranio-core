/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import path from 'path';

import {urn_log} from 'urn-lib';

import * as conf from '../conf/';

import {Atom, AtomShape} from '../typ/atom';

import {AuthAction} from '../typ/auth';

import {Passport} from '../typ/auth';

import * as urn_sto from '../sto/';

import {BLL} from './bll';

import {InsertFileParams} from './types';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class MediaBLL extends BLL<'media'>{
	
	protected storage:urn_sto.Storage;
	
	constructor(passport?:Passport){
		super('media', passport);
		switch(conf.get(`storage`)){
			case 'aws':{
				this.storage = urn_sto.aws.create();
				break;
			}
		}
	}
	
	public async insert_file(
		filepath: string,
		buffer:Buffer | ArrayBuffer | Blob,
		params?:Partial<InsertFileParams>
	):Promise<Atom<'media'>>{
		
		await super.authorize(AuthAction.WRITE);
		
		let new_filepath = filepath;
		if(!params || typeof params.override === 'undefined' || params.override === false){
			while(await this._is_already_stored(new_filepath)){
				new_filepath = _next_filepath(new_filepath);
			}
		}
		const upload_params:Partial<urn_sto.UploadParams> = {};
		if(params){
			if(typeof params.content_type === 'string' && params.content_type !== ''){
				upload_params.content_type = params.content_type;
			}
			if(typeof params.content_length === 'number' && params.content_length > 0){
				upload_params.content_length = params.content_length;
			}
		}
		const returned_filepath = await this.storage.upload(new_filepath, buffer, upload_params);
		const atom_shape:AtomShape<'media'> = {
			src: returned_filepath,
			filename: path.basename(returned_filepath),
			type: params?.content_type || 'unknown',
			size: params?.content_length || -1
		};
		// if(width){
		//   atom_shape.width = width;
		// }
		// if(height){
		//   atom_shape.height = height;
		// }
		const atom = await super.insert_new(atom_shape);
		return atom;
	}
	
	private async _is_already_stored(filepath:string):Promise<boolean>{
		return await this.storage.exists(filepath);
	}
	
}

function _next_filepath(filepath:string):string{
	const extension = path.extname(filepath);
	const basename = path.basename(filepath, extension); // with second param will remove the extension
	const splitted = basename.split('-');
	if(splitted.length > 1){
		const last = splitted.pop();
		const isnum = /^\d+$/.test(last || 'a'); // if it is only number
		if(isnum){
			const next = parseInt(last || '0') + 1;
			splitted.push(next.toString());
		}else{
			splitted.push('1');
		}
		const joined = path.join(path.dirname(filepath), splitted.join('-') + extension);
		return joined;
	}else{
		const joined = path.join(path.dirname(filepath), `${basename}-1${extension}`);
		return joined;
	}
	
}

export function create(passport?:Passport)
		:MediaBLL{
	urn_log.fn_debug(`Create MediaBLL`);
	return new MediaBLL(passport);
}
