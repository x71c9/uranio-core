"use strict";
/**
 * AWS Storage module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const urn_lib_1 = require("urn-lib");
const conf = __importStar(require("../../conf/server"));
// const urn_exc = urn_exception.init('UPLOADER_AWS', 'AWS Uploader');
/**
 * AWS Storage class
 */
let AWSStorage = class AWSStorage {
    constructor() {
        const bucket_name = conf.get('aws_bucket_name');
        const bucket_region = conf.get('aws_bucket_region');
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: conf.get(`aws_user_access_key_id`),
            secretAccessKey: conf.get(`aws_user_secret_access_key`),
            region: bucket_region
        });
        this.base_url = `https://${bucket_name}.s3.${bucket_region}.amazonaws.com`;
    }
    async upload(filepath, buffer, params) {
        const aws_params = {
            Bucket: conf.get(`aws_bucket_name`),
            Key: filepath,
            Body: buffer
        };
        if (params) {
            if (typeof params.content_type === 'string' && params.content_type !== '') {
                aws_params.ContentType = params.content_type;
            }
            if (typeof params.content_length === 'string' && params.content_length > 0) {
                aws_params.ContentLength = params.content_length;
            }
        }
        const aws_reponse = await this.s3.upload(aws_params).promise();
        return aws_reponse.Key;
    }
    async presigned(filepath, params) {
        const aws_params = {
            Bucket: conf.get(`aws_bucket_name`),
            Key: filepath,
            Expires: 60 // 1 minute
        };
        if (params) {
            //   if(typeof params.content_type === 'string' && params.content_type !== ''){
            //     aws_params.ContentType = params.content_type;
            //   }
            if (typeof params.content_length === 'string' && params.content_length > 0) {
                // aws_params.ContentLength = params.content_length;
                aws_params.Expires = params.content_length * .5;
            }
        }
        const aws_reponse = await this.s3.getSignedUrl('putObject', aws_params);
        return aws_reponse;
    }
    async exists(filepath) {
        const params = {
            Bucket: conf.get(`aws_bucket_name`),
            Key: filepath
        };
        try {
            await this.s3.headObject(params).promise();
            // const aws_obj = await this.s3.headObject(params).promise();
            // console.log('HEADOBJECT', aws_obj);
            return true;
        }
        catch (e) {
            return false;
        }
        return false;
    }
};
AWSStorage = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], AWSStorage);
function create() {
    urn_lib_1.urn_log.fn_debug(`Create AWSStorage`);
    return new AWSStorage();
}
exports.create = create;
//# sourceMappingURL=storage.js.map