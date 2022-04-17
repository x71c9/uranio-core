"use strict";
/**
 * Module for commong Layer methods.
 *
 * Layer are DAL and ACL.
 *
 * @packageDocumentation
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_query_object = void 0;
// import {Book} from '../server/types';
// import * as book from '../book/server';
const atm = __importStar(require("../atm/server"));
function search_query_object(query, atom_name) {
    // const search_object = {$or: [{$text: {$search: query}}]} as schema.Query.Logical<A>;
    const search_object = { $or: [] };
    const search_keys = atm.keys.get_search_indexes(atom_name);
    for (const key of search_keys) {
        const regex_query = {};
        const esacaped_query = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // will escape all regex special chars
        regex_query[key] = { $regex: esacaped_query, $options: 'i' }; // $options i = case insensitive
        search_object.$or.push(regex_query);
    }
    return search_object;
}
exports.search_query_object = search_query_object;
//# sourceMappingURL=index.js.map