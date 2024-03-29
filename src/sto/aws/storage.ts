/**
 * AWS Storage module
 *
 * @packageDocumentation
 */

import AWS from 'aws-sdk';

import {urn_log} from 'uranio-utils';

import * as env from '../../env/server';

import {Storage, UploadParams} from '../types';

// const urn_exc = urn_exception.init('UPLOADER_AWS', 'AWS Uploader');

/**
 * AWS Storage class
 */
@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class AWSStorage implements Storage {
	
	protected s3:AWS.S3;
	
	public base_url:string;
	
	constructor(){
		
		const bucket_name = env.get('aws_bucket_name');
		const bucket_region = env.get('aws_bucket_region');
		
		this.s3 = new AWS.S3({
			accessKeyId: env.get(`aws_user_access_key_id`),
			secretAccessKey: env.get(`aws_user_secret_access_key`),
			region: bucket_region
		});
		this.base_url = `https://${bucket_name}.s3.${bucket_region}.amazonaws.com`;
	}
	
	public async upload(
		filepath:string,
		buffer:ArrayBuffer | Buffer | Blob,
		params?:Partial<UploadParams>
	):Promise<string>{
		
		const aws_params:AWS.S3.PutObjectRequest = {
			Bucket: env.get(`aws_bucket_name`),
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
	
	public async presigned(
		filepath:string,
		params?:Partial<UploadParams>
	):Promise<string>{
		
		const aws_params = {
			Bucket: env.get(`aws_bucket_name`),
			Key: filepath,
			Expires: 60 // 1 minute
		};
		
		if(params){
		//   if(typeof params.content_type === 'string' && params.content_type !== ''){
		//     aws_params.ContentType = params.content_type;
		//   }
			if(typeof params.content_length === 'string' && params.content_length > 0){
				// aws_params.ContentLength = params.content_length;
				aws_params.Expires = params.content_length * .5;
			}
		}
		
		const aws_reponse = await this.s3.getSignedUrl('putObject', aws_params);
		
		return aws_reponse;
	}
	
	public async exists(filepath:string):Promise<boolean>{
		const params:AWS.S3.GetObjectRequest = {
			Bucket: env.get(`aws_bucket_name`),
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
		// return false;
	}
	
}

export function create()
		:AWSStorage{
	urn_log.trace(`Create AWSStorage`);
	return new AWSStorage();
}
