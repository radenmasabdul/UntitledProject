"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = void 0;
const isValidId = (id) => /^[a-zA-Z0-9\-]+$/.test(id);
exports.isValidId = isValidId;
