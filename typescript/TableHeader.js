"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class TableHeader extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.renderHeaderRow = (height, index) => {
            const { columns, headerRenderer: HeaderRenderer } = this.props;
            if (height <= 0) {
                return null;
            }
            const style = { width: '100%', height };
            const headerProps = { style, columns, headerIndex: index };
            return react_1.default.createElement(HeaderRenderer, Object.assign({}, headerProps, { key: index }));
        };
        this.renderFrozenRow = (rowData, index) => {
            const { columns, rowHeight, rowRenderer: RowRenderer } = this.props;
            const style = { width: '100%', height: rowHeight };
            // for frozen row the `rowIndex` is negative
            const rowIndex = -index - 1;
            const rowProps = { style, columns, rowData, rowIndex };
            return react_1.default.createElement(RowRenderer, Object.assign({}, rowProps, { key: index }));
        };
        this._setRef = (ref) => {
            this.headerRef = ref;
        };
    }
    scrollTo(offset) {
        if (this.headerRef) {
            this.headerRef.scrollLeft = offset;
        }
    }
    render() {
        const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
        if (height <= 0) {
            return null;
        }
        const style = {
            width,
            height,
            position: 'relative',
            overflow: 'hidden',
        };
        const innerStyle = {
            width: rowWidth,
            height,
        };
        const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
        return (react_1.default.createElement("div", { role: 'grid', ref: this._setRef, className: className, style: style },
            react_1.default.createElement("div", { role: 'rowgroup', style: innerStyle },
                rowHeights.map(this.renderHeaderRow),
                frozenData.map(this.renderFrozenRow))));
    }
}
exports.default = TableHeader;
//# sourceMappingURL=TableHeader.js.map