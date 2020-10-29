/**
 * Module for db connection
 *
 * @packageDocumentation
 */

/*
 * Import mogoose
 */
import mongoose from 'mongoose';

/*
 * Import urn_log
 */
import {urn_log, urn_return, urn_response, urn_error} from 'urn-lib';
// import {urn_log, urn_return, urn_response, URNError} from 'urn-lib';

/*
 * Instanciate urn_return with a log injector
 */
const urn_ret = urn_return.create(urn_log.return_injector);

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
 * URNDBConnection class
 */
class URNDBConnection {
	
	/*
	 * Connection mongoose connection
	 */
	private _connection:mongoose.Connection|null;
	
	/*
	 * Connection name
	 */
	public name:string;
	
	/*
	 * Connection ready state
	 * 0 = disconnected
	 * 1 = connected
	 * 2 = connecting
	 * 3 = disconnecting
	 */
	public readyState:number;
	
	/**
	 * Constructor function for URNDBConnection
	 *
	 * @param con_name - connection name
	 * @param db_host - database host
	 * @param db_port - database port number
	 * @param db_name - database name
	 */
	constructor(con_name:string, public db_host:string, public db_port:number, public db_name:string){
		
		this.name = con_name;
		this.readyState = 0;
		
		try{
			this._connection = mongoose.createConnection(this.get_uri(), mongoose_options);
			this._connection.on('connecting', () => { this._on_connecting(); });
			this._connection.on('connected', () => { this._on_connected(); });
			this._connection.on('disconnecting', () => { this._on_disconnecting(); });
			this._connection.on('disconnected', () => { this._on_disconnected(); });
			this._connection.on('close', () => { this._on_close(); });
			this._connection.on('reconnected', () => { this._on_reconnected(); });
			this._connection.on('error', (err) => { this._on_error(err) });
			this._connection.on('reconnectFailed', () => { this._on_reconnect_failed(); });
			this._connection.on('reconnectTries', () => { this._on_reconnect_tries(); });
			return this;
		}catch(err){
			throw urn_error.create('Cannot connect to [' + this.get_uri() + '] - ' + err.message);
			// throw new URNError('Cannot connect to [' + this.get_uri() + '] - ' + err.message);
		}
		
	}
	
	/**
	 * Close the connection
	 *
	 * @returns the closed URNDBConnection
	 */
	public async close()
			:Promise<urn_response.General<ConnectionInstance>>{
		if(this._connection == null)
			return urn_ret.return_error(
				500,
				`Trying to close a connection that was never created [${this.name}][${this.get_uri()}]`
			);
		try {
			await this._connection.close();
			return urn_ret.return_success('Connection closed', this);
		}catch(err){
			return urn_ret.return_error(
				500,
				'Cannot disconnect from [' + this.name + '][' + this.get_uri() + '] - '
					+ err.message,
				null,
				err
			);
		}
	}
	/**
	 * Get the connection URI
	 *
	 * @returns the connection URI
	 */
	public get_uri():string{
		return `mongodb://${this.db_host}:${this.db_port}/${this.db_name}`;
	}
	
	/**
	 * Function called when event onConnecting is fired
	 */
	private _on_connecting()
			:void{
		urn_log.debug(`Connection connecting [${this.name}][${this.get_uri()}]...`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onConnected is fired
	 */
	private _on_connected()
			:void{
		urn_log.debug(`Connection connected [${this.name}][${this.get_uri()}]`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onDisconnecting is fired
	 */
	private _on_disconnecting()
			:void{
		urn_log.debug(`Connection disconnecting [${this.name}][${this.get_uri()}]...`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onDisconnected id fired
	 */
	private _on_disconnected()
			:void{
		urn_log.debug(`Connection disconnected [${this.name}][${this.get_uri()}]`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onClose is fired
	 */
	private _on_close()
			:void{
		urn_log.debug(`Connection closed [${this.name}][${this.get_uri()}]`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onReconnected is fired
	 */
	private _on_reconnected()
			:void{
		urn_log.debug(`Connection reconnected [${this.name}][${this.get_uri()}]`);
		if(this._connection != null)
			this.readyState = this._connection.readyState;
	}
	
	/**
	 * Function called when event onError is fired
	 */
	private _on_error(e:Error)
			:void{
		throw urn_error.create(e.message, e);
		// throw new URNError(e.message, e);
	}
	
	/**
	 * Function called when event onReconnectFailed is fired
	 */
	private _on_reconnect_failed()
			:void{
		urn_log.debug(`Connection reconnectFailed [${this.name}][${this.get_uri()}]`);
	}
	
	/**
	 * Function called when event onReconnectTries is fired
	 */
	private _on_reconnect_tries()
			:void{
		urn_log.debug(`Connection reconnectTries [${this.name}][${this.get_uri()}]`);
	}
}

export type ConnectionInstance = InstanceType<typeof URNDBConnection>;

export function create_instance(con_name:string, db_host:string, db_port:number, db_name:string)
		:ConnectionInstance{
	return new URNDBConnection(con_name, db_host, db_port, db_name);
}
