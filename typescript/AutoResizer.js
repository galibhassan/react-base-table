"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
/**
 * Decorator component that automatically adjusts the width and height of a single child
 */
const AutoResizer = ({ className, width, height, children, onResize }) => {
    const disableWidth = typeof width === 'number';
    const disableHeight = typeof height === 'number';
    if (disableWidth && disableHeight) {
        return (react_1.default.createElement("div", { className: className, style: { width, height, position: 'relative' } }, children({ width, height })));
    }
    return (react_1.default.createElement(react_virtualized_auto_sizer_1.default, { className: className, disableWidth: disableWidth, disableHeight: disableHeight, onResize: onResize }, (size) => children({
        width: disableWidth ? width : size.width,
        height: disableHeight ? height : size.height,
    })));
};
exports.default = AutoResizer;
//# sourceMappingURL=AutoResizer.js.map