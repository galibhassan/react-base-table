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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const memoize_one_1 = __importDefault(require("memoize-one"));
const react_1 = __importDefault(require("react"));
const Column_1 = __importStar(require("./Column"));
const ColumnManager_1 = __importDefault(require("./ColumnManager"));
const ColumnResizer_1 = __importDefault(require("./ColumnResizer"));
const ExpandIcon_1 = __importDefault(require("./ExpandIcon"));
const GridTable_1 = __importDefault(require("./GridTable"));
const SortIndicator_1 = __importDefault(require("./SortIndicator"));
const SortOrder_1 = __importDefault(require("./SortOrder"));
const TableCell_1 = __importDefault(require("./TableCell"));
const TableHeaderCell_1 = __importDefault(require("./TableHeaderCell"));
const TableHeaderRow_1 = __importDefault(require("./TableHeaderRow"));
const TableRow_1 = __importDefault(require("./TableRow"));
const utils_1 = require("./utils");
const getContainerStyle = (width, maxWidth, height) => ({
    width,
    maxWidth,
    height,
    overflow: 'hidden',
});
const DEFAULT_COMPONENTS = {
    TableCell: TableCell_1.default,
    TableHeaderCell: TableHeaderCell_1.default,
    ExpandIcon: ExpandIcon_1.default,
    SortIndicator: SortIndicator_1.default,
};
const RESIZE_THROTTLE_WAIT = 50;
/**
 * React table component
 */
class BaseTable extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this._scrollbarPresenceChanged = false;
        this._scroll = { scrollLeft: 0, scrollTop: 0 };
        this._scrollHeight = 0;
        this._lastScannedRowIndex = -1;
        this._hasDataChangedSinceEndReached = true;
        this._depthMap = {};
        this._horizontalScrollbarSize = 0;
        this._verticalScrollbarSize = 0;
        this._getLeftTableContainerStyle = memoize_one_1.default(getContainerStyle);
        this.renderExpandIcon = ({ rowData, rowIndex, depth, onExpand }) => {
            const { rowKey, expandColumnKey, expandIconProps } = this.props;
            if (!expandColumnKey) {
                return null;
            }
            const expandable = rowIndex >= 0 && utils_1.hasChildren(rowData);
            const expanded = rowIndex >= 0 && this.state.expandedRowKeys.indexOf(rowData[`${rowKey}`]) >= 0;
            const extraProps = utils_1.callOrReturn(expandIconProps, { rowData, rowIndex, depth, expandable, expanded });
            const ExpandIconComponent = this._getComponent('ExpandIcon');
            return react_1.default.createElement(ExpandIconComponent, Object.assign({ depth: depth, expandable: expandable, expanded: expanded }, extraProps, { onExpand: onExpand }));
        };
        this.renderRow = ({ isScrolling, columns, rowData, rowIndex, style }) => {
            const { rowClassName, rowRenderer, rowEventHandlers, expandColumnKey } = this.props;
            const rowClass = utils_1.callOrReturn(rowClassName, { columns, rowData, rowIndex });
            const extraProps = utils_1.callOrReturn(this.props.rowProps, { columns, rowData, rowIndex });
            const rowKey = rowData[this.props.rowKey];
            const depth = this._depthMap[rowKey] || 0;
            const className = classnames_1.default(this._prefixClass('row'), rowClass, {
                [this._prefixClass(`row--depth-${depth}`)]: !!expandColumnKey && rowIndex >= 0,
                [this._prefixClass('row--expanded')]: !!expandColumnKey && this.state.expandedRowKeys.indexOf(rowKey) >= 0,
                [this._prefixClass('row--hovered')]: !isScrolling && rowKey === this.state.hoveredRowKey,
                [this._prefixClass('row--frozen')]: depth === 0 && rowIndex < 0,
                [this._prefixClass('row--customized')]: rowRenderer,
            });
            const rowProps = Object.assign({}, extraProps, { role: 'row', key: `row-${rowKey}`, isScrolling,
                className,
                style,
                columns,
                rowIndex,
                rowData,
                rowKey,
                expandColumnKey,
                depth,
                rowEventHandlers,
                rowRenderer, cellRenderer: this.renderRowCell, expandIconRenderer: this.renderExpandIcon, onRowExpand: this._handleRowExpand, 
                // for fixed table, we need to sync the hover state across the inner tables
                onRowHover: this.columnManager.hasFrozenColumns() ? this._handleRowHover : null });
            return react_1.default.createElement(TableRow_1.default, Object.assign({}, rowProps));
        };
        this.renderRowCell = ({ isScrolling, columns, column, columnIndex, rowData, rowIndex, expandIcon, }) => {
            if (column[ColumnManager_1.default.PlaceholderKey]) {
                return (react_1.default.createElement("div", { key: `row-${rowData[`${this.props.rowKey}`]}-cell-${column.key}-placeholder`, className: this._prefixClass('row-cell-placeholder'), style: this.columnManager.getColumnStyle(column.key) }));
            }
            const { className, dataKey, dataGetter, cellRenderer } = column;
            const TableCellComponent = this._getComponent('TableCell');
            const cellData = dataGetter
                ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
                : utils_1.getValue(rowData, dataKey);
            const cellProps = {
                isScrolling,
                cellData,
                columns,
                column,
                columnIndex,
                rowData,
                rowIndex,
                container: this,
            };
            const cell = utils_1.renderElement(cellRenderer ||
                react_1.default.createElement(TableCellComponent, { className: this._prefixClass('row-cell-text') }), cellProps);
            const cellCls = utils_1.callOrReturn(className, { cellData, columns, column, columnIndex, rowData, rowIndex });
            const cls = classnames_1.default(this._prefixClass('row-cell'), cellCls, {
                [this._prefixClass('row-cell--align-center')]: column.align === Column_1.Alignment.CENTER,
                [this._prefixClass('row-cell--align-right')]: column.align === Column_1.Alignment.RIGHT,
            });
            const extraProps = utils_1.callOrReturn(this.props.cellProps, { columns, column, columnIndex, rowData, rowIndex });
            const _a = extraProps || {}, { tagName } = _a, rest = __rest(_a, ["tagName"]);
            const Tag = tagName || 'div';
            return (react_1.default.createElement(Tag, Object.assign({ role: 'gridcell', key: `row-${rowData[`${this.props.rowKey}`]}-cell-${column.key}` }, rest, { className: cls, style: this.columnManager.getColumnStyle(column.key) }),
                expandIcon,
                cell));
        };
        this.renderHeader = ({ columns, headerIndex, style }) => {
            const { headerClassName, headerRenderer } = this.props;
            const headerClass = utils_1.callOrReturn(headerClassName, { columns, headerIndex });
            const extraProps = utils_1.callOrReturn(this.props.headerProps, { columns, headerIndex });
            const className = classnames_1.default(this._prefixClass('header-row'), headerClass, {
                [this._prefixClass('header-row--resizing')]: !!this.state.resizingKey,
                [this._prefixClass('header-row--customized')]: headerRenderer,
            });
            const headerProps = Object.assign({}, extraProps, { role: 'row', key: `header-${headerIndex}`, className,
                style,
                columns,
                headerIndex,
                headerRenderer, cellRenderer: this.renderHeaderCell, expandColumnKey: this.props.expandColumnKey, expandIcon: this._getComponent('ExpandIcon') });
            return react_1.default.createElement(TableHeaderRow_1.default, Object.assign({}, headerProps));
        };
        this._handleColumnResize = ({ key }, width) => {
            this.columnManager.setColumnWidth(key, width);
            this.setState({ resizingWidth: width });
            const column = this.columnManager.getColumn(key);
            this.props.onColumnResize({ column, width });
        };
        this.renderHeaderCell = ({ columns, column, columnIndex, headerIndex, expandIcon }) => {
            if (column[ColumnManager_1.default.PlaceholderKey]) {
                return (react_1.default.createElement("div", { key: `header-${headerIndex}-cell-${column.key}-placeholder`, className: this._prefixClass('header-cell-placeholder'), style: this.columnManager.getColumnStyle(column.key) }));
            }
            const { headerClassName, headerRenderer } = column;
            const { sortBy, sortState, headerCellProps } = this.props;
            const TableHeaderCellComponent = this._getComponent('TableHeaderCell');
            const SortIndicatorComponent = this._getComponent('SortIndicator');
            const cellProps = { columns, column, columnIndex, headerIndex, container: this };
            const cell = utils_1.renderElement(headerRenderer || react_1.default.createElement(TableHeaderCellComponent, { className: this._prefixClass('header-cell-text') }), cellProps);
            let sorting;
            let sortOrder;
            if (sortState) {
                const order = sortState[column.key];
                sorting = order === SortOrder_1.default.ASC || order === SortOrder_1.default.DESC;
                sortOrder = sorting ? order : SortOrder_1.default.ASC;
            }
            else {
                sorting = column.key === sortBy.key;
                sortOrder = sorting ? sortBy.order : SortOrder_1.default.ASC;
            }
            const cellCls = utils_1.callOrReturn(headerClassName, { columns, column, columnIndex, headerIndex });
            const cls = classnames_1.default(this._prefixClass('header-cell'), cellCls, {
                [this._prefixClass('header-cell--align-center')]: column.align === Column_1.Alignment.CENTER,
                [this._prefixClass('header-cell--align-right')]: column.align === Column_1.Alignment.RIGHT,
                [this._prefixClass('header-cell--sortable')]: column.sortable,
                [this._prefixClass('header-cell--sorting')]: sorting,
                [this._prefixClass('header-cell--resizing')]: column.key === this.state.resizingKey,
            });
            const extraProps = utils_1.callOrReturn(headerCellProps, { columns, column, columnIndex, headerIndex });
            const _a = extraProps || {}, { tagName } = _a, rest = __rest(_a, ["tagName"]);
            const Tag = tagName || 'div';
            return (react_1.default.createElement(Tag, Object.assign({ role: 'gridcell', key: `header-${headerIndex}-cell-${column.key}`, onClick: column.sortable ? this._handleColumnSort : null }, rest, { className: cls, style: this.columnManager.getColumnStyle(column.key), "data-key": column.key }),
                expandIcon,
                cell,
                column.sortable && (react_1.default.createElement(SortIndicatorComponent, { sortOrder: sortOrder, className: classnames_1.default(this._prefixClass('sort-indicator'), {
                        [this._prefixClass('sort-indicator--descending')]: sortOrder === SortOrder_1.default.DESC,
                    }) })),
                column.resizable && (react_1.default.createElement(ColumnResizer_1.default, { className: this._prefixClass('column-resizer'), column: column, onResizeStart: this._handleColumnResizeStart, onResizeStop: this._handleColumnResizeStop, onResize: this._handleColumnResize }))));
        };
        this._setContainerRef = (ref) => {
            this.tableNode = ref;
        };
        this._setMainTableRef = (ref) => {
            this.table = ref;
        };
        this._setLeftTableRef = (ref) => {
            this.leftTable = ref;
        };
        this._setRightTableRef = (ref) => {
            this.rightTable = ref;
        };
        this._handleScroll = (args) => {
            const lastScrollTop = this._scroll.scrollTop;
            this.scrollToPosition(args);
            this.props.onScroll(args);
            if (args.scrollTop > lastScrollTop) {
                this._maybeCallOnEndReached();
            }
        };
        this._handleVerticalScroll = ({ scrollTop }) => {
            const lastScrollTop = this._scroll.scrollTop;
            this.scrollToTop(scrollTop);
            if (scrollTop > lastScrollTop) {
                this._maybeCallOnEndReached();
            }
        };
        this._handleRowsRendered = (args) => {
            this.props.onRowsRendered(args);
            if (args.overscanStopIndex > this._lastScannedRowIndex) {
                this._lastScannedRowIndex = args.overscanStopIndex;
                this._maybeCallOnEndReached();
            }
        };
        this._handleRowHover = ({ hovered, rowKey }) => {
            this.setState({ hoveredRowKey: hovered ? rowKey : null });
        };
        this._handleRowExpand = ({ expanded, rowData, rowIndex, rowKey, }) => {
            const expandedRowKeys = utils_1.cloneArray(this.state.expandedRowKeys);
            if (expanded) {
                if (!(expandedRowKeys.indexOf(rowKey) >= 0)) {
                    expandedRowKeys.push(rowKey);
                }
            }
            else {
                const index = expandedRowKeys.indexOf(rowKey);
                if (index > -1) {
                    expandedRowKeys.splice(index, 1);
                }
            }
            // if `expandedRowKeys` is uncontrolled, update internal state
            if (this.props.expandedRowKeys === undefined) {
                this.setState({ expandedRowKeys });
            }
            this.props.onRowExpand({ expanded, rowData, rowIndex, rowKey });
            this.props.onExpandedRowsChange(expandedRowKeys);
        };
        this._handleColumnResizeStart = ({ key }) => {
            this.setState({ resizingKey: key });
        };
        this._handleColumnResizeStop = () => {
            this.setState({ resizingKey: null });
        };
        this._handleColumnSort = (event) => {
            const key = event.currentTarget.dataset.key;
            const { sortBy, sortState, onColumnSort } = this.props;
            let order = SortOrder_1.default.ASC;
            if (sortState) {
                order = sortState[key] === SortOrder_1.default.ASC ? SortOrder_1.default.DESC : SortOrder_1.default.ASC;
            }
            else if (key === sortBy.key) {
                order = sortBy.order === SortOrder_1.default.ASC ? SortOrder_1.default.DESC : SortOrder_1.default.ASC;
            }
            const column = this.columnManager.getColumn(key);
            onColumnSort({ column, key, order });
        };
        const { columns, children, expandedRowKeys, defaultExpandedRowKeys } = props;
        this.state = {
            scrollbarSize: 0,
            hoveredRowKey: null,
            resizingKey: null,
            resizingWidth: 0,
            expandedRowKeys: utils_1.cloneArray(props.expandedRowKeys !== undefined ? expandedRowKeys : defaultExpandedRowKeys),
        };
        this.columnManager = new ColumnManager_1.default(columns || utils_1.normalizeColumns(children), props.fixed);
        this._handleColumnResize = utils_1.throttle(this._handleColumnResize, RESIZE_THROTTLE_WAIT);
        this._data = props.data;
        this._flattenOnKeys = memoize_one_1.default((tree, keys, dataKey) => {
            this._depthMap = {};
            return utils_1.flattenOnKeys(tree, keys, this._depthMap, dataKey);
        });
    }
    /**
     * Get the DOM node of the table
     */
    getDOMNode() {
        return this.tableNode;
    }
    /**
     * Get the column manager
     */
    getColumnManager() {
        return this.columnManager;
    }
    /**
     * Get the expanded state, fallback to normal state if not expandable.
     */
    getExpandedState() {
        return {
            expandedData: this._data,
            expandedRowKeys: this.state.expandedRowKeys,
            expandedDepthMap: this._depthMap,
        };
    }
    /**
     * Get the total height of all rows, including expanded rows.
     */
    getTotalRowsHeight() {
        return this._data.length * this.props.rowHeight;
    }
    /**
     * Get the total width of all columns.
     */
    getTotalColumnsWidth() {
        return this.columnManager.getColumnsWidth();
    }
    /**
     * Forcefully re-render the inner Grid component.
     *
     * Calling `forceUpdate` on `Table` may not re-render the inner Grid since it uses `shallowCompare` as a
     * performance optimization.
     * Use this method if you want to manually trigger a re-render.
     * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
     */
    forceUpdateTable() {
        if (this.table) {
            this.table.forceUpdateTable();
        }
        if (this.leftTable) {
            this.leftTable.forceUpdateTable();
        }
        if (this.rightTable) {
            this.rightTable.forceUpdateTable();
        }
    }
    /**
     * Scroll to the specified offset.
     * Useful for animating position changes.
     *
     * @param offset
     */
    scrollToPosition(offset) {
        this._scroll = offset;
        if (this.table) {
            this.table.scrollToPosition(offset);
        }
        if (this.leftTable) {
            this.leftTable.scrollToTop(offset.scrollTop);
        }
        if (this.rightTable) {
            this.rightTable.scrollToTop(offset.scrollTop);
        }
    }
    /**
     * Scroll to the specified offset vertically.
     *
     * @param scrollTop
     */
    scrollToTop(scrollTop) {
        this._scroll.scrollTop = scrollTop;
        if (this.table) {
            this.table.scrollToPosition(this._scroll);
        }
        if (this.leftTable) {
            this.leftTable.scrollToTop(scrollTop);
        }
        if (this.rightTable) {
            this.rightTable.scrollToTop(scrollTop);
        }
    }
    /**
     * Scroll to the specified offset horizontally.
     *
     * @param scrollLeft
     */
    scrollToLeft(scrollLeft) {
        this._scroll.scrollLeft = scrollLeft;
        if (this.table) {
            this.table.scrollToPosition(this._scroll);
        }
    }
    /**
     * Scroll to the specified row.
     * By default, the table will scroll as little as possible to ensure the row is visible.
     * You can control the alignment of the row though by specifying an align property. Acceptable values are:
     *
     * - `auto` (default) - Scroll as little as possible to ensure the row is visible.
     * - `smart` - Same as `auto` if it is less than one viewport away, or it's the same as`center`.
     * - `center` - Center align the row within the table.
     * - `end` - Align the row to the bottom side of the table.
     * - `start` - Align the row to the top side of the table.
     * @param {number} rowIndex
     * @param {string} align
     */
    scrollToRow(rowIndex = 0, align = 'auto') {
        if (this.table) {
            this.table.scrollToRow(rowIndex, align);
        }
        if (this.leftTable) {
            this.leftTable.scrollToRow(rowIndex, align);
        }
        if (this.rightTable) {
            this.rightTable.scrollToRow(rowIndex, align);
        }
    }
    /**
     * Set `expandedRowKeys` manually.
     * This method is available only if `expandedRowKeys` is uncontrolled.
     *
     * @param expandedRowKeys
     */
    setExpandedRowKeys(expandedRowKeys) {
        // if `expandedRowKeys` is controlled
        if (this.props.expandedRowKeys !== undefined) {
            return;
        }
        this.setState({
            expandedRowKeys: utils_1.cloneArray(expandedRowKeys),
        });
    }
    renderMainTable() {
        const _a = this.props, { width, headerHeight, rowHeight, fixed } = _a, rest = __rest(_a, ["width", "headerHeight", "rowHeight", "fixed"]);
        const height = this._getTableHeight();
        let tableWidth = width - this._verticalScrollbarSize;
        if (fixed) {
            const columnsWidth = this.columnManager.getColumnsWidth();
            // make sure `scrollLeft` is always integer to fix a sync bug when scrolling to end horizontally
            tableWidth = Math.max(Math.round(columnsWidth), tableWidth);
        }
        return (react_1.default.createElement(GridTable_1.default, Object.assign({}, rest, this.state, { className: this._prefixClass('table-main'), ref: this._setMainTableRef, data: this._data, columns: this.columnManager.getMainColumns(), width: width, height: height, headerHeight: headerHeight, rowHeight: rowHeight, headerWidth: tableWidth + (fixed ? this._verticalScrollbarSize : 0), bodyWidth: tableWidth, headerRenderer: this.renderHeader, rowRenderer: this.renderRow, onScroll: this._handleScroll, onRowsRendered: this._handleRowsRendered })));
    }
    renderLeftTable() {
        if (!this.columnManager.hasLeftFrozenColumns()) {
            return null;
        }
        const _a = this.props, { width, headerHeight, rowHeight } = _a, rest = __rest(_a, ["width", "headerHeight", "rowHeight"]);
        const containerHeight = this._getFrozenContainerHeight();
        const offset = this._verticalScrollbarSize || 20;
        const columnsWidth = this.columnManager.getLeftFrozenColumnsWidth();
        return (react_1.default.createElement(GridTable_1.default, Object.assign({}, rest, this.state, { containerStyle: this._getLeftTableContainerStyle(columnsWidth, width, containerHeight), className: this._prefixClass('table-frozen-left'), ref: this._setLeftTableRef, data: this._data, columns: this.columnManager.getLeftFrozenColumns(), width: columnsWidth + offset, height: containerHeight, headerHeight: headerHeight, rowHeight: rowHeight, headerWidth: columnsWidth + offset, bodyWidth: columnsWidth + offset, headerRenderer: this.renderHeader, rowRenderer: this.renderRow, onScroll: this._handleVerticalScroll, onRowsRendered: utils_1.noop })));
    }
    renderRightTable() {
        if (!this.columnManager.hasRightFrozenColumns()) {
            return null;
        }
        const _a = this.props, { width, headerHeight, rowHeight } = _a, rest = __rest(_a, ["width", "headerHeight", "rowHeight"]);
        const containerHeight = this._getFrozenContainerHeight();
        const columnsWidth = this.columnManager.getRightFrozenColumnsWidth();
        const scrollbarWidth = this._verticalScrollbarSize;
        return (react_1.default.createElement(GridTable_1.default, Object.assign({}, rest, this.state, { containerStyle: this._getLeftTableContainerStyle(columnsWidth + scrollbarWidth, width, containerHeight), className: this._prefixClass('table-frozen-right'), ref: this._setRightTableRef, data: this._data, columns: this.columnManager.getRightFrozenColumns(), width: columnsWidth + scrollbarWidth, height: containerHeight, headerHeight: headerHeight, rowHeight: rowHeight, headerWidth: columnsWidth + scrollbarWidth, bodyWidth: columnsWidth, headerRenderer: this.renderHeader, rowRenderer: this.renderRow, onScroll: this._handleVerticalScroll, onRowsRendered: utils_1.noop })));
    }
    renderResizingLine() {
        const { width, fixed } = this.props;
        const { resizingKey } = this.state;
        if (!fixed || !resizingKey) {
            return null;
        }
        const columns = this.columnManager.getMainColumns();
        const idx = columns.findIndex((c) => c.key === resizingKey);
        const column = columns[idx];
        const { width: columnWidth, frozen } = column;
        const leftWidth = this.columnManager.recomputeColumnsWidth(columns.slice(0, idx));
        let left = leftWidth + columnWidth;
        if (!frozen) {
            left -= this._scroll.scrollLeft;
        }
        else if (frozen === Column_1.FrozenDirection.RIGHT) {
            const rightWidth = this.columnManager.recomputeColumnsWidth(columns.slice(idx + 1));
            if (rightWidth + columnWidth > width - this._verticalScrollbarSize) {
                left = columnWidth;
            }
            else {
                left = width - this._verticalScrollbarSize - rightWidth;
            }
        }
        const style = {
            left,
            height: this._getTableHeight() - this._horizontalScrollbarSize,
        };
        return react_1.default.createElement("div", { className: this._prefixClass('resizing-line'), style: style });
    }
    renderFooter() {
        const { footerHeight, footerRenderer } = this.props;
        if (footerHeight === 0) {
            return null;
        }
        return (react_1.default.createElement("div", { className: this._prefixClass('footer'), style: { height: footerHeight } }, utils_1.renderElement(footerRenderer)));
    }
    renderEmptyLayer() {
        const { data, footerHeight, emptyRenderer } = this.props;
        if (data && data.length) {
            return null;
        }
        const headerHeight = this._getHeaderHeight();
        return (react_1.default.createElement("div", { className: this._prefixClass('empty-layer'), style: { top: headerHeight, bottom: footerHeight } }, utils_1.renderElement(emptyRenderer, {})));
    }
    renderOverlay() {
        const { overlayRenderer } = this.props;
        return (react_1.default.createElement("div", { className: this._prefixClass('overlay') }, !!overlayRenderer && utils_1.renderElement(overlayRenderer, {})));
    }
    render() {
        const { classPrefix, width, fixed, data, frozenData, expandColumnKey, disabled, className, style, footerHeight, } = this.props;
        if (expandColumnKey) {
            this._data = this._flattenOnKeys(data, this.state.expandedRowKeys, `${this.props.rowKey}`);
        }
        else {
            this._data = data;
        }
        // should be after `this._data` assigned
        this._calcScrollbarSizes();
        const containerStyle = Object.assign({}, style, { width, height: this._getTableHeight() + footerHeight, position: 'relative' });
        const cls = classnames_1.default(classPrefix, className, {
            [`${classPrefix}--fixed`]: fixed,
            [`${classPrefix}--expandable`]: !!expandColumnKey,
            [`${classPrefix}--empty`]: data.length === 0,
            [`${classPrefix}--has-frozen-rows`]: frozenData.length > 0,
            [`${classPrefix}--has-frozen-columns`]: this.columnManager.hasFrozenColumns(),
            [`${classPrefix}--disabled`]: disabled,
        });
        return (react_1.default.createElement("div", { ref: this._setContainerRef, className: cls, style: containerStyle },
            this.renderFooter(),
            this.renderMainTable(),
            this.renderLeftTable(),
            this.renderRightTable(),
            this.renderResizingLine(),
            this.renderEmptyLayer(),
            this.renderOverlay()));
    }
    componentWillReceiveProps(nextProps) {
        const nextColumns = nextProps.columns || utils_1.normalizeColumns(nextProps.children);
        const columns = this.columnManager.getOriginalColumns();
        if (!utils_1.isObjectEqual(nextColumns, columns) || nextProps.fixed !== this.props.fixed) {
            this.columnManager.reset(nextColumns, nextProps.fixed);
        }
        if (nextProps.data !== this.props.data) {
            this._lastScannedRowIndex = -1;
            this._hasDataChangedSinceEndReached = true;
        }
        if (nextProps.maxHeight !== this.props.maxHeight || nextProps.height !== this.props.height) {
            this._maybeCallOnEndReached();
        }
        // if `expandedRowKeys` is controlled
        if (nextProps.expandColumnKey &&
            nextProps.expandedRowKeys !== undefined &&
            nextProps.expandedRowKeys !== this.props.expandedRowKeys) {
            this.setState({
                expandedRowKeys: utils_1.cloneArray(nextProps.expandedRowKeys),
            });
        }
    }
    componentDidMount() {
        const scrollbarSize = this.props.getScrollbarSize();
        if (scrollbarSize > 0) {
            this.setState({ scrollbarSize });
        }
    }
    componentDidUpdate() {
        this._maybeScrollbarPresenceChange();
    }
    _prefixClass(className) {
        return `${this.props.classPrefix}__${className}`;
    }
    _getTableHeight() {
        const { height, maxHeight, footerHeight } = this.props;
        let tableHeight = height - footerHeight;
        if (maxHeight > 0) {
            const frozenRowsHeight = this._getFrozenRowsHeight();
            const totalRowsHeight = this.getTotalRowsHeight();
            const headerHeight = this._getHeaderHeight();
            const totalHeight = headerHeight + frozenRowsHeight + totalRowsHeight + this._horizontalScrollbarSize;
            tableHeight = Math.min(totalHeight, maxHeight - footerHeight);
        }
        return tableHeight;
    }
    _getBodyHeight() {
        return this._getTableHeight() - this._getHeaderHeight() - this._getFrozenRowsHeight();
    }
    _getFrozenContainerHeight() {
        const { maxHeight } = this.props;
        const tableHeight = this._getTableHeight() - (this._data.length > 0 ? this._horizontalScrollbarSize : 0);
        // in auto height mode tableHeight = totalHeight
        if (maxHeight > 0) {
            return tableHeight;
        }
        const totalHeight = this.getTotalRowsHeight() + this._getHeaderHeight() + this._getFrozenRowsHeight();
        return Math.min(tableHeight, totalHeight);
    }
    _calcScrollbarSizes() {
        const { fixed, width } = this.props;
        const { scrollbarSize } = this.state;
        const totalRowsHeight = this.getTotalRowsHeight();
        const totalColumnsWidth = this.getTotalColumnsWidth();
        const prevHorizontalScrollbarSize = this._horizontalScrollbarSize;
        const prevVerticalScrollbarSize = this._verticalScrollbarSize;
        if (scrollbarSize === 0) {
            this._horizontalScrollbarSize = 0;
            this._verticalScrollbarSize = 0;
        }
        else {
            // we have to set `this._horizontalScrollbarSize` before calling `this._getBodyHeight`
            if (!fixed || totalColumnsWidth <= width - scrollbarSize) {
                this._horizontalScrollbarSize = 0;
                this._verticalScrollbarSize = totalRowsHeight > this._getBodyHeight() ? scrollbarSize : 0;
            }
            else {
                if (totalColumnsWidth > width) {
                    this._horizontalScrollbarSize = scrollbarSize;
                    this._verticalScrollbarSize =
                        totalRowsHeight > this._getBodyHeight() - this._horizontalScrollbarSize ? scrollbarSize : 0;
                }
                else {
                    this._horizontalScrollbarSize = 0;
                    this._verticalScrollbarSize = 0;
                    if (totalRowsHeight > this._getBodyHeight()) {
                        this._horizontalScrollbarSize = scrollbarSize;
                        this._verticalScrollbarSize = scrollbarSize;
                    }
                }
            }
        }
        if (prevHorizontalScrollbarSize !== this._horizontalScrollbarSize ||
            prevVerticalScrollbarSize !== this._verticalScrollbarSize) {
            this._scrollbarPresenceChanged = true;
        }
    }
    _maybeScrollbarPresenceChange() {
        if (this._scrollbarPresenceChanged) {
            const { onScrollbarPresenceChange } = this.props;
            this._scrollbarPresenceChanged = false;
            onScrollbarPresenceChange({
                size: this.state.scrollbarSize,
                horizontal: this._horizontalScrollbarSize > 0,
                vertical: this._verticalScrollbarSize > 0,
            });
        }
    }
    _maybeCallOnEndReached() {
        const { onEndReached, onEndReachedThreshold } = this.props;
        const { scrollTop } = this._scroll;
        const scrollHeight = this.getTotalRowsHeight();
        const clientHeight = this._getBodyHeight();
        if (!onEndReached || !clientHeight || !scrollHeight) {
            return;
        }
        const distanceFromEnd = scrollHeight - scrollTop - clientHeight + this._horizontalScrollbarSize;
        if (this._lastScannedRowIndex >= 0 &&
            distanceFromEnd <= onEndReachedThreshold &&
            (this._hasDataChangedSinceEndReached || scrollHeight !== this._scrollHeight)) {
            this._hasDataChangedSinceEndReached = false;
            this._scrollHeight = scrollHeight;
            onEndReached({ distanceFromEnd });
        }
    }
    _getComponent(name) {
        if (this.props.components && this.props.components[name]) {
            return this.props.components[name];
        }
        return DEFAULT_COMPONENTS[name];
    }
    _getHeaderHeight() {
        const { headerHeight } = this.props;
        if (Array.isArray(headerHeight)) {
            return headerHeight.reduce((sum, height) => sum + height, 0);
        }
        return headerHeight;
    }
    _getFrozenRowsHeight() {
        const { frozenData, rowHeight } = this.props;
        return frozenData.length * rowHeight;
    }
}
BaseTable.Column = Column_1.default;
BaseTable.PlaceholderKey = ColumnManager_1.default.PlaceholderKey;
BaseTable.defaultProps = {
    classPrefix: 'BaseTable',
    rowKey: 'id',
    data: [],
    frozenData: [],
    fixed: false,
    headerHeight: 50,
    rowHeight: 50,
    footerHeight: 0,
    defaultExpandedRowKeys: [],
    sortBy: {},
    useIsScrolling: false,
    overscanRowCount: 1,
    onEndReachedThreshold: 500,
    getScrollbarSize: utils_1.getScrollbarSize,
    onScroll: utils_1.noop,
    onRowsRendered: utils_1.noop,
    onScrollbarPresenceChange: utils_1.noop,
    onRowExpand: utils_1.noop,
    onExpandedRowsChange: utils_1.noop,
    onColumnSort: utils_1.noop,
    onColumnResize: utils_1.noop,
};
exports.default = BaseTable;
//# sourceMappingURL=BaseTable.js.map