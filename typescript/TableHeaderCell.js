"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TableHeaderCell = ({ className, column, columnIndex }) => (react_1.default.createElement("div", { className: className }, column.title));
exports.default = TableHeaderCell;
//# sourceMappingURL=TableHeaderCell.js.map