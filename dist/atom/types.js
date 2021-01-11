"use strict";
/**
 *
 * Atom type module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
// import urn_mdls from 'urn-mdls';
const urn_mdls_1 = __importDefault(require("urn-mdls"));
var models;
(function (models) {
    models.resources = urn_mdls_1.default.resources;
})(models = exports.models || (exports.models = {}));
// export type AtomModule<M extends urn_mdls.resources.Resource, A extends Atom<M>> = {
//   keys: urn_mdls.ModelKeysCategories<M>,
//   create: AtomCreateFunction<M,A>
// }
//# sourceMappingURL=types.js.map