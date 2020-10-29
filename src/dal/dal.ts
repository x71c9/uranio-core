/**
 * Abstract Class for Data Access Layer
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
// class URNDAL<Resource> {
class URNDAL {
	
	constructor(public name:string){
	
	}
	
	private async _find(){
		// TODO implement
	}
	
	public async find(){
		return await this._find();
	}
	
	public async find_with_sensitive(){
		return await this._find();
	}
	
	private async _find_by_id(){
		// TODO implement
	}
	
	public async find_by_id(){
		return await this._find_by_id();
	}
	
	public async find_by_id_with_sesitive(){
		return await this._find_by_id();
	}
	
	private async _find_one(){
		// TODO implement
	}
	
	public async find_one(){
		return await this._find_one();
	}
	
	public async find_one_with_sensitve(){
		return await this._find_one();
	}
	
	private async _insert_one(){
		// TODO implement
	}
	
	public async insert_one(){
		return await this._insert_one();
	}
	
	public async insert_one_with_sensitve(){
		return await this._insert_one();
	}
	
	private async _update_one(){
		// TODO implement
	}
	
	public async update_one(){
		return await this._update_one();
	}
	
	public async update_one_with_sensitve(){
		return await this._update_one();
	}
	
	private async _delete_one(){
		// TODO implement
	}
	
	public async delete_one(){
		return await this._delete_one();
	}
	
	public async delete_one_with_sensitve(){
		return await this._delete_one();
	}
	
	public async is_valid_id(){
		// TODO implement
	}
	
}

export type DALInstance = InstanceType<typeof URNDAL>;

export default function create_instance(name:string)
		:DALInstance{
	
	urn_log.fn_debug('create_instance for URNDAL');

	return new URNDAL(name);
	
}
