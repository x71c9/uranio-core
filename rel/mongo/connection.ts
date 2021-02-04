/**
 * Module for db connection
 *
 * @packageDocumentation
 */

import mongoose from 'mongoose';

import {urn_log,  urn_exception} from 'urn-lib';

import {AtomName} from '../../types';

import {ConnectionName} from './types';

const urn_exc = urn_exception.init('DBC_M', 'Mongoose DB Connection');

/*
 * Define default mongoose option for connection
 */
const mongoose_options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
};

/**
 * MongooseDBConnection class
 */
@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class MongooseDBConnection {
	
	/*
	 * Connection mongoose connection
	 */
	private _connection:mongoose.Connection;
	
	/*
	 * Connection name
	 */
	public name:ConnectionName;
	
	/*
	 * Connection ready state
	 * 0 = disconnected
	 * 1 = connected
	 * 2 = connecting
	 * 3 = disconnecting
	 */
	public readyState:number;
	
	/*
	 * Connection URI
	 */
	public uri:string;
	
	/**
	 * Constructor function for URNDBConnection
	 *
	 * @param con_name - connection name
	 * @param db_host - database host
	 * @param db_port - database port number
	 * @param db_name - database name
	 */
	constructor(con_name:ConnectionName, public db_host:string, public db_port:number, public db_name:string){
		
		this.name = con_name;
		this.uri = `mongodb://${this.db_host}:${this.db_port}/${this.db_name}`;
		
		this.readyState = 0;
		this._connection = mongoose.createConnection(this.uri, mongoose_options);
		this._connection.on('connecting', () => { this._on_connecting(); });
		this._connection.on('connected', () => { this._on_connected(); });
		this._connection.on('disconnecting', () => { this._on_disconnecting(); });
		this._connection.on('disconnected', () => { this._on_disconnected(); });
		this._connection.on('close', () => { this._on_close(); });
		this._connection.on('reconnected', () => { this._on_reconnected(); });
		this._connection.on('error', (err) => { this._on_error(err); });
		this._connection.on('reconnectFailed', () => { this._on_reconnect_failed(); });
		this._connection.on('reconnectTries', () => { this._on_reconnect_tries(); });
		return this;
		
	}
	
	/**
	 * Get a relation
	 *
	 * @returns a Relation
	 */
	public create_model<A extends AtomName>(relation_name:A, schema:mongoose.Schema)
			:mongoose.Model<mongoose.Document>{
		return this._connection.model(relation_name, schema);
	}
	
	/**
	 * Close the connection
	 *
	 * @returns the closed URNDBConnection
	 */
	public async close()
			:Promise<ConnectionInstance>{
		if(this._connection == null){
			const err_msg = `Cannot close. Connection is null. [${this.name}][${this.uri}].`;
			throw urn_exc.create('CLOSE_CON_NULL', err_msg);
		}
		await this._connection.close();
		return this;
	}
	
	// public is_valid_id(id:string)
	//     :boolean{
	//   return mongoose.Types.ObjectId.isValid(id);
	// }
	
	/**
	 * Function called when event onConnecting is fired
	 */
	private _on_connecting()
			:void{
		urn_log.debug(`Connection connecting [${this.name}][${this.uri}]...`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onConnected is fired
	 */
	private _on_connected()
			:void{
		urn_log.debug(`Connection connected [${this.name}][${this.uri}]`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onDisconnecting is fired
	 */
	private _on_disconnecting()
			:void{
		urn_log.debug(`Connection disconnecting [${this.name}][${this.uri}]...`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onDisconnected id fired
	 */
	private _on_disconnected()
			:void{
		urn_log.debug(`Connection disconnected [${this.name}][${this.uri}]`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onClose is fired
	 */
	private _on_close()
			:void{
		urn_log.debug(`Connection closed [${this.name}][${this.uri}]`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onReconnected is fired
	 */
	private _on_reconnected()
			:void{
		urn_log.debug(`Connection reconnected [${this.name}][${this.uri}]`);
		if(this._connection)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onError is fired
	 */
	private _on_error(e:Error)
			:void{
		const err_msg = `General Error.`;
		throw urn_exc.create('ERR', err_msg, e);
	}
	
	/**
	 * Function called when event onReconnectFailed is fired
	 */
	private _on_reconnect_failed()
			:void{
		urn_log.debug(`Connection reconnectFailed [${this.name}][${this.uri}]`);
	}
	
	/**
	 * Function called when event onReconnectTries is fired
	 */
	private _on_reconnect_tries()
			:void{
		urn_log.debug(`Connection reconnectTries [${this.name}][${this.uri}]`);
	}
}

export type ConnectionInstance = InstanceType<typeof MongooseDBConnection>;

export function create(con_name:ConnectionName, db_host:string, db_port:number, db_name:string)
		:ConnectionInstance{
	urn_log.debug(`Create MongooseDBConnection`);
	return new MongooseDBConnection(con_name, db_host, db_port, db_name);
}

