"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const SortOrder_1 = __importDefault(require("./SortOrder"));
/**
 * default SortIndicator for BaseTable
 */
const SortIndicator = ({ sortOrder, className, style }) => {
    const cls = classnames_1.default('BaseTable__sort-indicator', className, {
        'BaseTable__sort-indicator--descending': sortOrder === SortOrder_1.default.DESC,
    });
    return (react_1.default.createElement("div", { className: cls, style: Object.assign({ userSelect: 'none', width: '16px', height: '16px', lineHeight: '16px', textAlign: 'center' }, style) }, sortOrder === SortOrder_1.default.DESC ? '\u2193' : '\u2191'));
};
exports.default = SortIndicator;
//# sourceMappingURL=SortIndicator.js.map