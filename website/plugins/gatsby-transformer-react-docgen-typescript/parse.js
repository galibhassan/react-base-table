"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = parseMetadata;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _reactDocgen = require("react-docgen");

var _parse = require("react-docgen/dist/parse");

var _codeFrame = require("@babel/code-frame");

var _displaynameHandler = require("./displayname-handler");

var _doclets = require("./doclets");

const defaultHandlers = [_reactDocgen.handlers.propTypeHandler, _reactDocgen.handlers.propTypeCompositionHandler, _reactDocgen.handlers.propDocBlockHandler, _reactDocgen.handlers.flowTypeHandler, _reactDocgen.handlers.defaultPropsHandler, _reactDocgen.handlers.componentDocblockHandler, _reactDocgen.handlers.componentMethodsHandler, _reactDocgen.handlers.componentMethodsJsDocHandler];
let fileCount = 0;
/**
 * Wrap handlers to pass in additional arguments such as the File node
 */

function makeHandlers(node, handlers) {
  handlers = (handlers || []).map(h => (...args) => h(...args, node));
  return [(0, _displaynameHandler.createDisplayNameHandler)(node.absolutePath || `/UnknownComponent${++fileCount}`), ...handlers];
}

function parseMetadata(content, node, options) {
  let components = [];
  const _ref = options || {},
        {
    handlers,
    resolver: userResolver
  } = _ref,
        parseOptions = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["handlers", "resolver"]);

  try {
    components = (0, _reactDocgen.parse)(content, userResolver || _reactDocgen.resolver.findAllComponentDefinitions, defaultHandlers.concat(makeHandlers(node, handlers)), Object.assign({}, parseOptions, {
      filename: node.absolutePath
    }));
  } catch (err) {
    if (err.message === _parse.ERROR_MISSING_DEFINITION) return []; // reset the stack to here since it's not helpful to see all the react-docgen guts
    // const parseErr = new Error(err.message)

    if (err.loc) {
      err.codeFrame = (0, _codeFrame.codeFrameColumns)(content, err.loc.start || {
        start: err.loc
      }, {
        highlightCode: true
      });
    }

    throw err;
  }

  if (components.length === 1) {
    components[0].displayName = components[0].displayName.replace(/\d+$/, ``);
  }

  components.forEach(component => {
    component.docblock = component.description || ``;
    component.doclets = (0, _doclets.parseDoclets)(component);
    component.description = (0, _doclets.cleanDoclets)(component.description);
    component.props = Object.keys(component.props || {}).map(propName => {
      const prop = component.props[propName];
      prop.name = propName;
      prop.docblock = prop.description || ``;
      prop.doclets = (0, _doclets.parseDoclets)(prop, propName);
      prop.description = (0, _doclets.cleanDoclets)(prop.description);
      (0, _doclets.applyPropDoclets)(prop);
      return prop;
    });
  });
  return components;
}