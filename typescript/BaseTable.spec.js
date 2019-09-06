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
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
const BaseTable_1 = __importDefault(require("./BaseTable"));
const RENDERER = () => null;
const columns = [
    {
        key: 'code',
        title: 'code',
        dataKey: 'code',
        width: 50,
    },
    {
        key: 'name',
        title: 'name',
        dataKey: 'name',
        width: 50,
    },
];
const data = [
    {
        id: '1',
        code: '1',
        name: '1',
    },
    {
        id: '2',
        code: '2',
        name: '2',
    },
];
const Table = (_a) => {
    var { width, height } = _a, restProps = __rest(_a, ["width", "height"]);
    return react_1.default.createElement(BaseTable_1.default, Object.assign({ width: width, height: height }, restProps));
};
Table.defaultProps = {
    width: 100,
    height: 100,
    data,
    columns,
};
describe('Table', () => {
    test('renders correctly', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, null)).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive className', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { className: 'custom-class' })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive style', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { style: { color: 'red' } })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive children', () => {
        const tree = react_test_renderer_1.default
            .create(react_1.default.createElement(Table, null,
            react_1.default.createElement(BaseTable_1.default.Column, { key: 'code', dataKey: 'code', width: 30 }),
            react_1.default.createElement(BaseTable_1.default.Column, { key: 'name', dataKey: 'name', width: 30 })))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive empty data', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { data: [] })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can specific a different rowKey', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { rowKey: 'code' })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive width', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { width: 100 })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive height', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { height: 100 })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive rowHeight', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { rowHeight: 30 })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive headerHeight', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { headerHeight: 30 })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can be set to fixed', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { fixed: true })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can be set to disabled', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { disabled: true })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can hide the header', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { headerHeight: 0 })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can freeze rows', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { frozenData: data })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive an emptyRenderer callback', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { emptyRenderer: RENDERER })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive an headerRenderer callback', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { headerRenderer: RENDERER })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive an rowRenderer callback', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { rowRenderer: RENDERER })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive headerClassName', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { headerClassName: 'custom-class' })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive rowClassName', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { rowClassName: 'custom-class' })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive expandColumnKey', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { expandColumnKey: 'code' })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive defaultExpandedRowKeys', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { expandColumnKey: 'code', defaultExpandedRowKeys: ['1'] })).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('table can receive expandedRowKeys', () => {
        const tree = react_test_renderer_1.default.create(react_1.default.createElement(Table, { expandColumnKey: 'code', expandedRowKeys: ['1'] })).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
//# sourceMappingURL=BaseTable.spec.js.map