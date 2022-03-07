"use strict";
/**
 * DB Connection methods module
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
exports.disconnect = exports.connect = void 0;
const conf = __importStar(require("../conf/server"));
const models_1 = require("../rel/mongo/models");
function connect() {
    switch (conf.get(`db`)) {
        case 'mongo': {
            (0, models_1.create_all_connection)();
            break;
        }
    }
}
exports.connect = connect;
async function disconnect(connection_name) {
    switch (conf.get(`db`)) {
        case 'mongo': {
            if (models_1.mongo_app.connections) {
                for (const [conn_name, conn_inst] of Object.entries(models_1.mongo_app.connections)) {
                    if (typeof connection_name === 'undefined' || conn_name === connection_name) {
                        await conn_inst.close();
                    }
                }
            }
            break;
        }
    }
}
exports.disconnect = disconnect;
//# sourceMappingURL=cnn.js.map