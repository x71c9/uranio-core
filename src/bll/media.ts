/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
import path from 'path';

import {urn_log} from 'uranio-utils';

import {schema} from '../sch/server';

import * as conf from '../conf/server';

import {AuthAction, Passport} from '../typ/auth';

import * as sto from '../sto/server';

import {BLL} from './bll';

import {InsertFileParams} from './types';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
export class MediaBLL extends BLL<'_media'>{
	
	protected storage:sto.Storage;
	
	constructor(passport?:Passport){
		super('_media', passport);
		switch(conf.get(`storage`)){
			case 'aws':{
				this.storage = sto.aws.create();
				break;
			}
		}
	}
	
	public async insert_file(
		filepath: string,
		buffer:Buffer | ArrayBuffer | Blob,
		params?:Partial<InsertFileParams>
	):Promise<schema.Atom<'_media'>>{
		
		await super.authorize(AuthAction.WRITE);
		
		let new_filepath = filepath;
		if(!params || typeof params.override === 'undefined' || params.override === false){
			while(await this._is_already_stored(new_filepath)){
				new_filepath = _next_filepath(new_filepath);
			}
		}
		const upload_params:Partial<sto.UploadParams> = {};
		if(params){
			if(typeof params.content_type === 'string' && params.content_type !== ''){
				upload_params.content_type = params.content_type;
			}
			if(typeof params.content_length === 'number' && params.content_length > 0){
				upload_params.content_length = params.content_length;
			}
		}
		const returned_filepath = await this.storage.upload(new_filepath, buffer, upload_params);
		const atom_shape:schema.AtomShape<'_media'> = {
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
	
	public async presigned(
		filepath: string,
		params?:Partial<InsertFileParams>
	):Promise<string>{
		
		await super.authorize(AuthAction.WRITE);
		
		const upload_params:Partial<sto.UploadParams> = {};
		if(params){
			if(typeof params.content_type === 'string' && params.content_type !== ''){
				upload_params.content_type = params.content_type;
			}
			if(typeof params.content_length === 'number' && params.content_length > 0){
				upload_params.content_length = params.content_length;
			}
		}
		const presigned_url = await this.storage.presigned(filepath, upload_params);
		return presigned_url;
	}
	
	public async find<D extends schema.Depth>(query:schema.Query<'_media'>, options?:schema.Query.Options<'_media',D>)
			:Promise<schema.Molecule<'_media',D>[]>{
		const resp = await this._al.select(query, options);
		return this._array_with_full_src(resp);
	}
	
	public async find_by_id<D extends schema.Depth>(id:string, options?:schema.Query.Options<'_media',D>)
			:Promise<schema.Molecule<'_media',D>>{
		const resp = await this._al.select_by_id(id, options);
		return this._with_full_src(resp);
	}
	
	public async find_one<D extends schema.Depth>(query:schema.Query<'_media'>, options?:schema.Query.Options<'_media',D>)
			:Promise<schema.Molecule<'_media',D>>{
		const resp = await this._al.select_one(query, options);
		return this._with_full_src(resp);
	}
	
	public async insert_new(atom_shape:schema.AtomShape<'_media'>)
			:Promise<schema.Atom<'_media'>>{
		const media_shape = this._remove_full_src(atom_shape);
		const resp = await this._al.insert_one(media_shape);
		return this._with_full_src(resp);
	}
	
	public async update_by_id<D extends schema.Depth>(id:string, partial_atom:Partial<schema.AtomShape<'_media'>>, options?:schema.Query.Options<'_media',D>)
			:Promise<schema.Molecule<'_media',D>>{
		const partial_media = this._remove_full_src(partial_atom);
		const resp = await this._al.alter_by_id(id, partial_media, options);
		return this._with_full_src(resp);
	}
	
	public async update_one<D extends schema.Depth>(atom:schema.Atom<'_media'>, options?:schema.Query.Options<'_media',D>)
			:Promise<schema.Molecule<'_media',D>>{
		const media = this._remove_full_src(atom);
		const resp = await this.update_by_id(media._id, media as Partial<schema.AtomShape<'_media'>>, options);
		return this._with_full_src(resp);
	}
	
	public async update_multiple(ids:string[], partial_atom:Partial<schema.AtomShape<'_media'>>)
			:Promise<schema.Atom<'_media'>[]>{
		const partial_media = this._remove_full_src(partial_atom);
		const resp = await this._al.alter_multiple(ids, partial_media as Partial<schema.AtomShape<'_media'>>);
		return this._with_full_src(resp);
	}
	
	// public async find_multiple<D extends schema.Depth>(ids:string[])
	//     :Promise<schema.Molecule<'_media',D>[]>{
	//   const resp = await this._al.select_multiple<D>(ids);
	//   return this._with_full_src(resp);
	// }
	
	public async insert_multiple(atom_shapes:schema.AtomShape<'_media'>[], skip_on_error=false)
			:Promise<schema.Atom<'_media'>[]>{
		for(let shape of atom_shapes){
			shape = this._remove_full_src(shape);
		}
		const resp = await this._al.insert_multiple(atom_shapes, skip_on_error);
		return this._with_full_src(resp);
	}
	
	public async remove_multiple(ids:string[])
			:Promise<schema.Atom<'_media'>[]>{
		const resp = await this._al.delete_multiple(ids);
		return this._with_full_src(resp);
	}
	
	private _remove_full_src(media:schema.Atom<'_media'>):schema.Atom<'_media'>;
	private _remove_full_src(media:schema.AtomShape<'_media'>):schema.AtomShape<'_media'>;
	private _remove_full_src(media:Partial<schema.AtomShape<'_media'>>):Partial<schema.AtomShape<'_media'>>;
	private _remove_full_src(media:Partial<schema.AtomShape<'_media'>>):Partial<schema.AtomShape<'_media'>>{
		if(typeof media.src === 'string' && media.src.indexOf(this.storage.base_url) === 0){
			media.src = media.src.replace(this.storage.base_url, '');
		}
		return media;
	}
	
	private _with_full_src<D extends schema.Depth>(media:schema.Molecule<'_media',D>[]):schema.Molecule<'_media',D>[]
	private _with_full_src<D extends schema.Depth>(media:schema.Molecule<'_media',D>):schema.Molecule<'_media',D>
	private _with_full_src<D extends schema.Depth>(media:schema.Molecule<'_media',D> | schema.Molecule<'_media',D>[])
			:schema.Molecule<'_media',D> | schema.Molecule<'_media',D>[]{
		if(Array.isArray(media)){
			for(const m of media){
				m.src = `${this.storage.base_url}/${m.src}`;
			}
			return media;
		}
		media.src = `${this.storage.base_url}/${media.src}`;
		return media;
	}
	
	private _array_with_full_src<D extends schema.Depth>(medias:schema.Molecule<'_media',D>[])
			:schema.Molecule<'_media',D>[]{
		for(const media of medias){
			media.src = `${this.storage.base_url}/${media.src}`;
		}
		return medias;
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
	urn_log.trace(`Create MediaBLL`);
	return new MediaBLL(passport);
}
