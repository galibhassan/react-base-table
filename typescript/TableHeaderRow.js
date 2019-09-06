"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utils_1 = require("./utils");
/**
 * HeaderRow component for BaseTable
 */
const TableHeaderRow = (_a) => {
    var { className, style, columns, headerIndex, cellRenderer: CellRenderer, headerRenderer, expandColumnKey, expandIcon: ExpandIcon, tagName: Tag } = _a, rest = __rest(_a, ["className", "style", "columns", "headerIndex", "cellRenderer", "headerRenderer", "expandColumnKey", "expandIcon", "tagName"]);
    let cells = columns.map((column, columnIndex) => {
        const cellProps = {
            columns,
            column,
            columnIndex,
            headerIndex,
            expandIcon: column.key === expandColumnKey && react_1.default.createElement(ExpandIcon, null),
        };
        return react_1.default.createElement(CellRenderer, Object.assign({}, cellProps, { key: columnIndex }));
    });
    if (headerRenderer) {
        cells = utils_1.renderElement(headerRenderer, { cells, columns, headerIndex });
    }
    return (react_1.default.createElement(Tag, Object.assign({}, rest, { className: className, style: style }), cells));
};
TableHeaderRow.defaultProps = {
    tagName: 'div',
};
exports.default = TableHeaderRow;
//# sourceMappingURL=TableHeaderRow.js.map