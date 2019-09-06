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
 * Row component for BaseTable
 */
class TableRow extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleExpand = (expanded) => {
            const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
            if (onRowExpand) {
                onRowExpand({ expanded, rowData, rowIndex, rowKey });
            }
        };
        this.getEventHandlers = (handlers = {}) => {
            const { rowData, rowIndex, rowKey, onRowHover } = this.props;
            const eventHandlers = {};
            Object.keys(handlers).forEach((eventKey) => {
                const callback = handlers[eventKey];
                if (typeof callback === 'function') {
                    eventHandlers[eventKey] = (event) => {
                        callback({ rowData, rowIndex, rowKey, event });
                    };
                }
            });
            if (onRowHover) {
                const mouseEnterHandler = eventHandlers.onMouseEnter;
                eventHandlers.onMouseEnter = (event) => {
                    onRowHover({
                        hovered: true,
                        rowData,
                        rowIndex,
                        rowKey,
                        event,
                    });
                    if (mouseEnterHandler) {
                        mouseEnterHandler(event);
                    }
                };
                const mouseLeaveHandler = eventHandlers.onMouseLeave;
                eventHandlers.onMouseLeave = (event) => {
                    onRowHover({
                        hovered: false,
                        rowData,
                        rowIndex,
                        rowKey,
                        event,
                    });
                    if (mouseLeaveHandler) {
                        mouseLeaveHandler(event);
                    }
                };
            }
            return eventHandlers;
        };
    }
    render() {
        /* eslint-disable no-unused-vars */
        const _a = this.props, { isScrolling, className, style, columns, rowIndex, rowData, expandColumnKey, depth, rowEventHandlers, rowRenderer, cellRenderer: CellRenderer, expandIconRenderer: ExpandIconRenderer, tagName: Tag, 
        // omit the following from rest
        rowKey, onRowHover, onRowExpand } = _a, rest = __rest(_a, ["isScrolling", "className", "style", "columns", "rowIndex", "rowData", "expandColumnKey", "depth", "rowEventHandlers", "rowRenderer", "cellRenderer", "expandIconRenderer", "tagName", "rowKey", "onRowHover", "onRowExpand"]);
        /* eslint-enable no-unused-vars */
        const expandIconProps = { rowData, rowIndex, depth, onExpand: this.handleExpand };
        const expandIcon = react_1.default.createElement(ExpandIconRenderer, Object.assign({}, expandIconProps));
        let cells = columns.map((column, columnIndex) => {
            const cellProps = {
                isScrolling,
                columns,
                column,
                columnIndex,
                rowData,
                rowIndex,
                expandIcon: column.key === expandColumnKey && expandIcon,
            };
            return react_1.default.createElement(CellRenderer, Object.assign({}, cellProps, { key: columnIndex }));
        });
        if (rowRenderer) {
            cells = utils_1.renderElement(rowRenderer, { isScrolling, cells, columns, rowData, rowIndex, depth });
        }
        const eventHandlers = this.getEventHandlers(rowEventHandlers);
        return (react_1.default.createElement(Tag, Object.assign({}, rest, { className: className, style: style }, eventHandlers), cells));
    }
}
TableRow.defaultProps = {
    tagName: 'div',
};
exports.default = TableRow;
//# sourceMappingURL=TableRow.js.map