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
/**
 * default ExpandIcon for BaseTable
 */
class ExpandIcon extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this._handleClick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const { onExpand, expanded } = this.props;
            onExpand(!expanded);
        };
    }
    render() {
        const _a = this.props, { expandable, expanded, indentSize, depth, onExpand } = _a, rest = __rest(_a, ["expandable", "expanded", "indentSize", "depth", "onExpand"]);
        if (!expandable && indentSize === 0) {
            return null;
        }
        const cls = classnames_1.default('BaseTable__expand-icon', {
            'BaseTable__expand-icon--expanded': expanded,
        });
        return (react_1.default.createElement("div", Object.assign({}, rest, { className: cls, onClick: expandable && onExpand ? this._handleClick : null, style: {
                fontFamily: 'initial',
                cursor: 'pointer',
                userSelect: 'none',
                width: '16px',
                minWidth: '16px',
                height: '16px',
                lineHeight: '16px',
                fontSize: '16px',
                textAlign: 'center',
                transition: 'transform 0.15s ease-out',
                transform: `rotate(${expandable && expanded ? 90 : 0}deg)`,
                marginLeft: depth * indentSize,
            } }), expandable && '\u25B8'));
    }
}
ExpandIcon.defaultProps = {
    depth: 0,
    indentSize: 16,
};
exports.default = ExpandIcon;
//# sourceMappingURL=ExpandIcon.js.map