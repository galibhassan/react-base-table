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
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const react_window_1 = require("react-window");
const TableHeader_1 = __importDefault(require("./TableHeader"));
/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.renderRow = (args) => {
            const { data, columns, rowRenderer: RowRenderer } = this.props;
            const rowData = data[args.rowIndex];
            const newProps = Object.assign({}, args, { columns, rowData });
            return react_1.default.createElement(RowRenderer, Object.assign({}, newProps));
        };
        this._setHeaderRef = (ref) => {
            this.headerRef = ref;
        };
        this._setBodyRef = (ref) => {
            this.bodyRef = ref;
        };
        this._itemKey = ({ rowIndex }) => {
            const { data, rowKey } = this.props;
            return data[rowIndex][rowKey];
        };
        this._handleItemsRendered = ({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex, }) => {
            this.props.onRowsRendered({
                overscanStartIndex: overscanRowStartIndex,
                overscanStopIndex: overscanRowStopIndex,
                startIndex: visibleRowStartIndex,
                stopIndex: visibleRowStopIndex,
            });
        };
    }
    forceUpdateTable() {
        if (this.headerRef) {
            this.headerRef.forceUpdate();
        }
        if (this.bodyRef) {
            this.bodyRef.forceUpdate();
        }
    }
    scrollToPosition(args) {
        if (this.headerRef) {
            this.headerRef.scrollTo(args.scrollLeft);
        }
        if (this.bodyRef) {
            this.bodyRef.scrollTo(args);
        }
    }
    scrollToTop(scrollTop) {
        if (this.bodyRef) {
            this.bodyRef.scrollTo({ scrollTop, scrollLeft: 0 });
        }
    }
    scrollToLeft(scrollLeft) {
        if (this.headerRef) {
            this.headerRef.scrollTo(scrollLeft);
        }
        if (this.bodyRef) {
            this.bodyRef.scrollTo({ scrollLeft, scrollTop: 0 });
        }
    }
    scrollToRow(rowIndex = 0, align = 'auto') {
        if (this.bodyRef) {
            this.bodyRef.scrollToItem({ rowIndex, align });
        }
    }
    render() {
        const _a = this.props, { containerStyle, classPrefix, className, data, frozenData, width, height, rowHeight, headerWidth, bodyWidth, useIsScrolling, onScroll, hoveredRowKey, overscanRowCount, 
        // omit from rest
        style, onScrollbarPresenceChange } = _a, rest = __rest(_a, ["containerStyle", "classPrefix", "className", "data", "frozenData", "width", "height", "rowHeight", "headerWidth", "bodyWidth", "useIsScrolling", "onScroll", "hoveredRowKey", "overscanRowCount", "style", "onScrollbarPresenceChange"]);
        const headerHeight = this._getHeaderHeight();
        const frozenRowCount = frozenData.length;
        const frozenRowsHeight = rowHeight * frozenRowCount;
        const cls = classnames_1.default(`${classPrefix}__table`, className);
        const containerProps = containerStyle ? { style: containerStyle } : null;
        return (react_1.default.createElement("div", Object.assign({ role: 'table', className: cls }, containerProps),
            react_1.default.createElement(react_window_1.FixedSizeGrid, Object.assign({}, rest, { className: `${classPrefix}__body`, ref: this._setBodyRef, itemKey: this._itemKey, width: width, height: Math.max(height - headerHeight - frozenRowsHeight, 0), rowHeight: rowHeight, rowCount: data.length, overscanRowCount: overscanRowCount, columnWidth: bodyWidth, columnCount: 1, overscanColumnCount: 0, useIsScrolling: useIsScrolling, onScroll: onScroll, onItemsRendered: this._handleItemsRendered, children: this.renderRow })),
            headerHeight + frozenRowsHeight > 0 && (
            // put header after body and reverse the display order via css
            // to prevent header's shadow being covered by body
            react_1.default.createElement(TableHeader_1.default, Object.assign({}, rest, { className: `${classPrefix}__header`, ref: this._setHeaderRef, data: data, frozenData: frozenData, width: width, height: Math.min(headerHeight + frozenRowsHeight, height), rowWidth: headerWidth, rowHeight: rowHeight, headerHeight: this.props.headerHeight, headerRenderer: this.props.headerRenderer, rowRenderer: this.props.rowRenderer, hoveredRowKey: frozenRowCount > 0 ? hoveredRowKey : null })))));
    }
    _getHeaderHeight() {
        const { headerHeight } = this.props;
        if (Array.isArray(headerHeight)) {
            return headerHeight.reduce((sum, height) => sum + height, 0);
        }
        return headerHeight;
    }
}
exports.default = GridTable;
//# sourceMappingURL=GridTable.js.map