"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.create = exports.MediaBLL = void 0;
/**
 * Default Class for Business Logic Layer
 *
 * @packageDocumentation
 */
const path_1 = __importDefault(require("path"));
const urn_lib_1 = require("urn-lib");
const conf = __importStar(require("../conf/server"));
const auth_1 = require("../typ/auth");
const sto = __importStar(require("../sto/server"));
const bll_1 = require("./bll");
let MediaBLL = class MediaBLL extends bll_1.BLL {
    constructor(passport) {
        super('media', passport);
        switch (conf.get(`storage`)) {
            case 'aws': {
                this.storage = sto.aws.create();
                break;
            }
        }
    }
    async insert_file(filepath, buffer, params) {
        await super.authorize(auth_1.AuthAction.WRITE);
        let new_filepath = filepath;
        if (!params || typeof params.override === 'undefined' || params.override === false) {
            while (await this._is_already_stored(new_filepath)) {
                new_filepath = _next_filepath(new_filepath);
            }
        }
        const upload_params = {};
        if (params) {
            if (typeof params.content_type === 'string' && params.content_type !== '') {
                upload_params.content_type = params.content_type;
            }
            if (typeof params.content_length === 'number' && params.content_length > 0) {
                upload_params.content_length = params.content_length;
            }
        }
        const returned_filepath = await this.storage.upload(new_filepath, buffer, upload_params);
        const atom_shape = {
            src: returned_filepath,
            filename: path_1.default.basename(returned_filepath),
            type: (params === null || params === void 0 ? void 0 : params.content_type) || 'unknown',
            size: (params === null || params === void 0 ? void 0 : params.content_length) || -1
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
    async presigned(filepath, params) {
        await super.authorize(auth_1.AuthAction.WRITE);
        const upload_params = {};
        if (params) {
            if (typeof params.content_type === 'string' && params.content_type !== '') {
                upload_params.content_type = params.content_type;
            }
            if (typeof params.content_length === 'number' && params.content_length > 0) {
                upload_params.content_length = params.content_length;
            }
        }
        const presigned_url = await this.storage.presigned(filepath, upload_params);
        return presigned_url;
    }
    async find(query, options) {
        const resp = await this._al.select(query, options);
        return this._array_with_full_src(resp);
    }
    async find_by_id(id, options) {
        const resp = await this._al.select_by_id(id, options);
        return this._with_full_src(resp);
    }
    async find_one(query, options) {
        const resp = await this._al.select_one(query, options);
        return this._with_full_src(resp);
    }
    async insert_new(atom_shape) {
        const media_shape = this._remove_full_src(atom_shape);
        const resp = await this._al.insert_one(media_shape);
        return this._with_full_src(resp);
    }
    async update_by_id(id, partial_atom) {
        const partial_media = this._remove_full_src(partial_atom);
        const resp = await this._al.alter_by_id(id, partial_media);
        return this._with_full_src(resp);
    }
    async update_one(atom) {
        const media = this._remove_full_src(atom);
        const resp = await this.update_by_id(media._id, media);
        return this._with_full_src(resp);
    }
    async update_multiple(ids, partial_atom) {
        const partial_media = this._remove_full_src(partial_atom);
        const resp = await this._al.alter_multiple(ids, partial_media);
        return this._with_full_src(resp);
    }
    // public async find_multiple<D extends schema.Depth>(ids:string[])
    //     :Promise<schema.Molecule<'media',D>[]>{
    //   const resp = await this._al.select_multiple<D>(ids);
    //   return this._with_full_src(resp);
    // }
    async insert_multiple(atom_shapes) {
        for (let shape of atom_shapes) {
            shape = this._remove_full_src(shape);
        }
        const resp = await this._al.insert_multiple(atom_shapes);
        return this._with_full_src(resp);
    }
    async remove_multiple(ids) {
        const resp = await this._al.delete_multiple(ids);
        return this._with_full_src(resp);
    }
    _remove_full_src(media) {
        if (typeof media.src === 'string' && media.src.indexOf(this.storage.base_url) === 0) {
            media.src = media.src.replace(this.storage.base_url, '');
        }
        return media;
    }
    _with_full_src(media) {
        if (Array.isArray(media)) {
            for (const m of media) {
                m.src = `${this.storage.base_url}/${m.src}`;
            }
            return media;
        }
        media.src = `${this.storage.base_url}/${media.src}`;
        return media;
    }
    _array_with_full_src(medias) {
        for (const media of medias) {
            media.src = `${this.storage.base_url}/${media.src}`;
        }
        return medias;
    }
    async _is_already_stored(filepath) {
        return await this.storage.exists(filepath);
    }
};
MediaBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], MediaBLL);
exports.MediaBLL = MediaBLL;
function _next_filepath(filepath) {
    const extension = path_1.default.extname(filepath);
    const basename = path_1.default.basename(filepath, extension); // with second param will remove the extension
    const splitted = basename.split('-');
    if (splitted.length > 1) {
        const last = splitted.pop();
        const isnum = /^\d+$/.test(last || 'a'); // if it is only number
        if (isnum) {
            const next = parseInt(last || '0') + 1;
            splitted.push(next.toString());
        }
        else {
            splitted.push('1');
        }
        const joined = path_1.default.join(path_1.default.dirname(filepath), splitted.join('-') + extension);
        return joined;
    }
    else {
        const joined = path_1.default.join(path_1.default.dirname(filepath), `${basename}-1${extension}`);
        return joined;
    }
}
function create(passport) {
    urn_lib_1.urn_log.fn_debug(`Create MediaBLL`);
    return new MediaBLL(passport);
}
exports.create = create;
//# sourceMappingURL=media.js.map