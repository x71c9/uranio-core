/**
 * AWS Storage module
 *
 * @packageDocumentation
 */

// import path from 'path';

import AWS from 'aws-sdk';

// import {urn_log, urn_exception} from 'urn-lib';
import {urn_log} from 'urn-lib';

import {core_config} from '../../cnf/defaults';

import {Storage, UploadParams} from '../types';

// const urn_exc = urn_exception.init('UPLOADER_AWS', 'AWS Uploader');

/**
 * AWS Storage class
 */
@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class AWSStorage implements Storage {
	
	protected s3:AWS.S3;
	
	constructor(){
		this.s3 = new AWS.S3({
			accessKeyId: core_config.aws_user_access_key_id,
			secretAccessKey: core_config.aws_user_secret_access_key,
			region: 'eu-south-1'
		});
	}
	
	public async upload(
		filepath:string,
		buffer:ArrayBuffer | Buffer | Blob,
		params?:Partial<UploadParams>
	):Promise<string>{
		
		const aws_params:AWS.S3.PutObjectRequest = {
			Bucket: core_config.aws_bucket_name,
			Key: filepath,
			Body: buffer
		};
		
		if(params){
			if(typeof params.content_type === 'string' && params.content_type !== ''){
				aws_params.ContentType = params.content_type;
			}
			if(typeof params.content_length === 'string' && params.content_length > 0){
				aws_params.ContentLength = params.content_length;
			}
		}
		
		const aws_reponse = await this.s3.upload(aws_params).promise();
		
		return aws_reponse.Key;
	}
	
	public async exists(filepath:string):Promise<boolean>{
		const params:AWS.S3.GetObjectRequest = {
			Bucket: core_config.aws_bucket_name,
			Key: filepath
		};
		try{
			await this.s3.headObject(params).promise();
			// const aws_obj = await this.s3.headObject(params).promise();
			// console.log('HEADOBJECT', aws_obj);
			return true;
		}catch(e){
			return false;
		}
		return false;
	}
	
}

export function create()
		:AWSStorage{
	urn_log.fn_debug(`Create AWSStorage`);
	return new AWSStorage();
}
