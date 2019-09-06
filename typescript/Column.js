"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
var Alignment;
(function (Alignment) {
    Alignment["LEFT"] = "left";
    Alignment["CENTER"] = "center";
    Alignment["RIGHT"] = "right";
})(Alignment = exports.Alignment || (exports.Alignment = {}));
exports.FrozenDirection = {
    LEFT: 'left',
    RIGHT: 'right',
    DEFAULT: true,
    NONE: false,
};
/**
 * Column for BaseTable
 */
class Column extends react_1.default.Component {
}
Column.Alignment = Alignment;
Column.FrozenDirection = exports.FrozenDirection;
exports.default = Column;
//# sourceMappingURL=Column.js.map