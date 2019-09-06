"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function renderElement(renderer, props) {
    if (!renderer) {
        return null;
    }
    if (react_1.default.isValidElement(renderer)) {
        return react_1.default.cloneElement(renderer, props);
    }
    else {
        return react_1.default.createElement(renderer, props);
    }
}
exports.renderElement = renderElement;
function normalizeColumns(elements) {
    const columns = [];
    react_1.default.Children.forEach(elements, (element) => {
        if (react_1.default.isValidElement(element) && element.key) {
            const column = Object.assign({}, element.props, { key: element.key });
            columns.push(column);
        }
    });
    return columns;
}
exports.normalizeColumns = normalizeColumns;
function isObjectEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }
    if (objA === null && objB === null) {
        return true;
    }
    if (objA === null || objB === null) {
        return false;
    }
    if (typeof objA !== 'object' || typeof objB !== 'object') {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // tslint:disable-next-line
    for (let i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        const valueA = objA[key];
        const valueB = objB[key];
        if (typeof valueA !== typeof valueB) {
            return false;
        }
        if (typeof valueA === 'function') {
            continue;
        }
        if (typeof valueA === 'object') {
            if (!isObjectEqual(valueA, valueB)) {
                return false;
            }
            else {
                continue;
            }
        }
        if (valueA !== valueB) {
            return false;
        }
    }
    return true;
}
exports.isObjectEqual = isObjectEqual;
function callOrReturn(funcOrValue, ...args) {
    return typeof funcOrValue === 'function' ? funcOrValue(...args) : funcOrValue;
}
exports.callOrReturn = callOrReturn;
function hasChildren(data) {
    return Array.isArray(data.children) && data.children.length > 0;
}
exports.hasChildren = hasChildren;
function unflatten(array, rootId = null, dataKey = 'id', parentKey = 'parentId') {
    const tree = [];
    const childrenMap = {};
    const length = array.length;
    for (let i = 0; i < length; i++) {
        const item = Object.assign({}, array[i]);
        const id = item[dataKey];
        const parentId = item[parentKey];
        if (!childrenMap[id]) {
            childrenMap[id] = [];
        }
        item.children = childrenMap[id];
        if (parentId !== undefined && parentId !== rootId) {
            if (!childrenMap[parentId]) {
                childrenMap[parentId] = [];
            }
            childrenMap[parentId].push(item);
        }
        else {
            tree.push(item);
        }
    }
    return tree;
}
exports.unflatten = unflatten;
function flattenOnKeys(tree, keys, depthMap = {}, dataKey = 'id') {
    if (!keys || !keys.length) {
        return tree;
    }
    const array = [];
    const keysSet = new Set();
    keys.forEach((x) => keysSet.add(x));
    let stack = [].concat(tree);
    stack.forEach((x) => (depthMap[x[dataKey]] = 0));
    while (stack.length > 0) {
        const item = stack.shift();
        array.push(item);
        if (keysSet.has(item[dataKey]) && Array.isArray(item.children) && item.children.length > 0) {
            stack = [].concat(item.children, stack);
            item.children.forEach((x) => (depthMap[x[dataKey]] = depthMap[item[dataKey]] + 1));
        }
    }
    return array;
}
exports.flattenOnKeys = flattenOnKeys;
// Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array
function cloneArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }
    return [].concat(array);
}
exports.cloneArray = cloneArray;
// tslint:disable-next-line:no-empty
function noop() { }
exports.noop = noop;
function toString(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value === null || value === undefined) {
        return '';
    }
    return value.toString ? value.toString() : '';
}
exports.toString = toString;
function getPathSegments(path) {
    const pathArray = path.split('.');
    const parts = [];
    for (let i = 0; i < pathArray.length; i++) {
        let p = pathArray[i];
        while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
            p = p.slice(0, -1) + '.';
            p += pathArray[++i];
        }
        parts.push(p);
    }
    return parts;
}
// changed from https://github.com/sindresorhus/dot-prop/blob/master/index.js
function getValue(object, path, defaultValue) {
    if (object === null || typeof object !== 'object' || typeof path !== 'string') {
        return defaultValue;
    }
    const pathArray = getPathSegments(path);
    for (let i = 0; i < pathArray.length; i++) {
        if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
            return defaultValue;
        }
        object = object[pathArray[i]];
        if (object === undefined || object === null) {
            if (i !== pathArray.length - 1) {
                return defaultValue;
            }
            break;
        }
    }
    return object;
}
exports.getValue = getValue;
// copied from https://30secondsofcode.org/function#throttle
function throttle(fn, wait) {
    let inThrottle;
    let lastFn;
    let lastTime;
    return function () {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        }
        else {
            clearTimeout(lastFn);
            lastFn = setTimeout(() => {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
}
exports.throttle = throttle;
// copied from https://github.com/react-bootstrap/dom-helpers
let scrollbarSize;
function getScrollbarSize(recalculate) {
    if ((!scrollbarSize && scrollbarSize !== 0) || recalculate) {
        if (typeof window !== 'undefined' && window.document && window.document.createElement) {
            const scrollDiv = document.createElement('div');
            scrollDiv.style.position = 'absolute';
            scrollDiv.style.top = '-9999px';
            scrollDiv.style.width = '50px';
            scrollDiv.style.height = '50px';
            scrollDiv.style.overflow = 'scroll';
            document.body.appendChild(scrollDiv);
            scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
        }
    }
    return scrollbarSize;
}
exports.getScrollbarSize = getScrollbarSize;
function addClassName(el, className) {
    if (el.classList) {
        el.classList.add(className);
    }
    else {
        if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
            el.className += ` ${className}`;
        }
    }
}
exports.addClassName = addClassName;
function removeClassName(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    }
    else {
        el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
    }
}
exports.removeClassName = removeClassName;
exports.eventsFor = {
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        stop: 'touchend',
    },
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        stop: 'mouseup',
    },
};
exports.isMouseEvent = (in_event) => {
    return in_event.type === exports.eventsFor.mouse.start || in_event.type === exports.eventsFor.mouse.move ||
        in_event.type === exports.eventsFor.mouse.stop;
};
exports.isTouchEvent = (in_event) => {
    return in_event.type === exports.eventsFor.touch.start || in_event.type === exports.eventsFor.touch.move ||
        in_event.type === exports.eventsFor.touch.stop;
};
//# sourceMappingURL=utils.js.map