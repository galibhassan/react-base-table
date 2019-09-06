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
const INVALID_VALUE = null;
// copied from https://github.com/mzabriskie/react-draggable/blob/master/lib/utils/domFns.js
function addUserSelectStyles(doc) {
    if (!doc) {
        return;
    }
    let styleEl = doc.getElementById('react-draggable-style-el');
    if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.type = 'text/css';
        styleEl.id = 'react-draggable-style-el';
        styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {background: transparent;}\n';
        styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {background: transparent;}\n';
        doc.getElementsByTagName('head')[0].appendChild(styleEl);
    }
    if (doc.body) {
        utils_1.addClassName(doc.body, 'react-draggable-transparent-selection');
    }
}
exports.addUserSelectStyles = addUserSelectStyles;
function removeUserSelectStyles(doc) {
    try {
        if (doc && doc.body) {
            utils_1.removeClassName(doc.body, 'react-draggable-transparent-selection');
        }
        if (doc.selection) {
            doc.selection.empty();
        }
        else {
            window.getSelection().removeAllRanges(); // remove selection caused by scroll
        }
    }
    catch (e) {
        // probably IE
    }
}
exports.removeUserSelectStyles = removeUserSelectStyles;
let dragEventFor = utils_1.eventsFor.mouse;
/**
 * ColumnResizer for BaseTable
 */
class ColumnResizer extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.isDragging = false;
        this.lastX = INVALID_VALUE;
        this.width = 0;
        this._setHandleRef = (ref) => {
            this.handleRef = ref;
        };
        this._handleClick = (e) => {
            e.stopPropagation();
        };
        this._handleMouseDown = (e) => {
            dragEventFor = utils_1.eventsFor.mouse;
            this._handleDragStart(e.nativeEvent);
        };
        this._handleMouseUp = (e) => {
            dragEventFor = utils_1.eventsFor.mouse;
            this._handleDragStop(e.nativeEvent);
        };
        this._handleTouchStart = (e) => {
            dragEventFor = utils_1.eventsFor.touch;
            this._handleDragStart(e.nativeEvent);
        };
        this._handleTouchEnd = (e) => {
            dragEventFor = utils_1.eventsFor.touch;
            this._handleDragStop(e.nativeEvent);
        };
        this._handleDragStart = (e) => {
            if (utils_1.isMouseEvent(e)) {
                if (typeof e.button === 'number' && e.button !== 0) {
                    return;
                }
            }
            this.isDragging = true;
            this.lastX = INVALID_VALUE;
            this.width = this.props.column.width;
            this.props.onResizeStart(this.props.column);
            const { ownerDocument } = this.handleRef;
            addUserSelectStyles(ownerDocument);
            ownerDocument.addEventListener(dragEventFor.move, this._handleDrag);
            ownerDocument.addEventListener(dragEventFor.stop, this._handleDragStop);
        };
        this._handleDragStop = (e) => {
            if (!this.isDragging) {
                return;
            }
            this.isDragging = false;
            this.props.onResizeStop(this.props.column);
            const { ownerDocument } = this.handleRef;
            removeUserSelectStyles(ownerDocument);
            ownerDocument.removeEventListener(dragEventFor.move, this._handleDrag);
            ownerDocument.removeEventListener(dragEventFor.stop, this._handleDragStop);
        };
        this._handleDrag = (e) => {
            let clientX;
            if (utils_1.isTouchEvent(e)) {
                e.preventDefault();
                if (e.targetTouches && e.targetTouches[0]) {
                    clientX = e.targetTouches[0].clientX;
                }
            }
            else if (utils_1.isMouseEvent(e)) {
                clientX = e.clientX;
            }
            const { offsetParent } = this.handleRef;
            const offsetParentRect = offsetParent.getBoundingClientRect();
            const x = clientX + offsetParent.scrollLeft - offsetParentRect.left;
            if (this.lastX === INVALID_VALUE) {
                this.lastX = x;
                return;
            }
            const { column, minWidth: MIN_WIDTH } = this.props;
            const { width, maxWidth, minWidth = MIN_WIDTH } = column;
            const movedX = x - this.lastX;
            if (!movedX) {
                return;
            }
            this.width = this.width + movedX;
            this.lastX = x;
            let newWidth = this.width;
            if (maxWidth && newWidth > maxWidth) {
                newWidth = maxWidth;
            }
            else if (newWidth < minWidth) {
                newWidth = minWidth;
            }
            if (newWidth === width) {
                return;
            }
            this.props.onResize(column, newWidth);
        };
    }
    componentWillMount() {
        if (this.handleRef) {
            const { ownerDocument } = this.handleRef;
            ownerDocument.removeEventListener(utils_1.eventsFor.mouse.move, this._handleDrag);
            ownerDocument.removeEventListener(utils_1.eventsFor.mouse.stop, this._handleDragStop);
            ownerDocument.removeEventListener(utils_1.eventsFor.touch.move, this._handleDrag);
            ownerDocument.removeEventListener(utils_1.eventsFor.touch.stop, this._handleDragStop);
            removeUserSelectStyles(ownerDocument);
        }
    }
    render() {
        const _a = this.props, { style, column, onResizeStart, onResize, onResizeStop, minWidth } = _a, rest = __rest(_a, ["style", "column", "onResizeStart", "onResize", "onResizeStop", "minWidth"]);
        return (react_1.default.createElement("div", Object.assign({}, rest, { ref: this._setHandleRef, onClick: this._handleClick, onMouseDown: this._handleMouseDown, onMouseUp: this._handleMouseUp, onTouchStart: this._handleTouchStart, onTouchEnd: this._handleTouchEnd, style: Object.assign({ userSelect: 'none', touchAction: 'none', position: 'absolute', top: 0, bottom: 0, right: 0, cursor: 'col-resize' }, style) })));
    }
}
ColumnResizer.defaultProps = {
    onResizeStart: utils_1.noop,
    onResize: utils_1.noop,
    onResizeStop: utils_1.noop,
    minWidth: 30,
};
exports.default = ColumnResizer;
//# sourceMappingURL=ColumnResizer.js.map