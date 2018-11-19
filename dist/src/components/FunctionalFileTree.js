"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var fp = require("lodash/fp");
var React = require("react");
var fa_1 = require("react-icons/lib/fa/");
var fa_2 = require("react-icons/lib/fa/");
var fa_3 = require("react-icons/lib/fa/");
var labelClassname = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  cursor: pointer;\n  padding: 1px 0;\n  white-space: nowrap;\n  overflow-x: scroll;\n"], ["\n  cursor: pointer;\n  padding: 1px 0;\n  white-space: nowrap;\n  overflow-x: scroll;\n"])));
var initState = {
    timeout: 0,
};
var FunctionalFileTree = (function (_super) {
    __extends(FunctionalFileTree, _super);
    function FunctionalFileTree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = initState;
        _this.getPathToNode = function () {
            var _a = _this.props.isRoot, isRoot = _a === void 0 ? true : _a;
            var _b = _this.props.pathToNode, pathToNode = _b === void 0 ? isRoot ? '' : '0' : _b;
            return pathToNode;
        };
        _this._getId = function () {
            return fp.curry(localGetId)(_this.getPathToNode());
        };
        _this.onMouseEnter = function () {
            var _a = _this.props, treeData = _a.treeData, _b = _a.getId, getId = _b === void 0 ? _this._getId() : _b, _c = _a.onHover, onHover = _c === void 0 ? localOnHover : _c, _d = _a.hoverDelay, hoverDelay = _d === void 0 ? 0 : _d;
            if (!Array.isArray(treeData)) {
                _this.setState({
                    timeout: setTimeout(function () { return onHover(getId(treeData)); }, hoverDelay),
                });
            }
        };
        _this.onMouseLeave = function () {
            clearTimeout(_this.state.timeout);
        };
        _this.getIcon = function (node) {
            var isDirectory = _this.props.isDirectory;
            if (!isDirectory(node)) {
                var _a = _this.props.getLabelIcon, getLabelIcon = _a === void 0 ? localGetLabelIcon : _a;
                return getLabelIcon(node);
            }
            var _b = _this.props, isExpanded = _b.isExpanded, _c = _b.getFoldIcons, getFoldIcons = _c === void 0 ? localGetFoldIcons : _c;
            var _d = getFoldIcons(node), openIcon = _d[0], closedIcon = _d[1];
            if (isExpanded(node)) {
                return openIcon;
            }
            return closedIcon;
        };
        return _this;
    }
    FunctionalFileTree.prototype.shouldComponentUpdate = function (_a) {
        var nextTree = _a.treeData, shouldUpdate = _a.shouldUpdate;
        return shouldUpdate(this.props.treeData, nextTree);
    };
    FunctionalFileTree.prototype.render = function () {
        var _a = this.props, treeData = _a.treeData, getChildren = _a.getChildren, isExpanded = _a.isExpanded, isDirectory = _a.isDirectory, _b = _a.getId, getId = _b === void 0 ? this._getId() : _b, _c = _a.getStyle, getStyle = _c === void 0 ? localGetStyle : _c, _d = _a.getClassname, getClassname = _d === void 0 ? localGetClassname : _d, _e = _a.onClick, onClick = _e === void 0 ? localOnClick : _e, _f = _a.sortChildren, sortChildren = _f === void 0 ? localSortChildren : _f;
        var _g = this.props.getLabel, getLabel = _g === void 0 ? getId : _g;
        var pathToNode = this.getPathToNode();
        var curriedTreeMapper = fp.curry(treeMapper)(this.props)(pathToNode);
        if (fp.isArray(treeData)) {
            return (React.createElement(React.Fragment, null, sortChildren(treeData).map(curriedTreeMapper)));
        }
        var treeNode = treeData;
        var userClassname = getClassname(treeNode) || '';
        var length = this.getPathToNode().split('.').length;
        var functionalFileTreeClassname = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      padding-left: ", "px;\n    "], ["\n      padding-left: ", "px;\n    "])), 10 * length);
        var combinedClassname = emotion_1.cx(labelClassname, functionalFileTreeClassname, userClassname);
        var onNodeClick = function () { return onClick(getId(treeNode)); };
        var shouldShowChildren = isDirectory(treeNode) && isExpanded(treeNode);
        var children = function () { return React.createElement("div", null, sortChildren(getChildren(treeNode)).map(curriedTreeMapper)); };
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: getStyle(treeNode), className: combinedClassname, onClick: onNodeClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
                React.createElement("span", null, this.getIcon(treeNode)),
                " ",
                React.createElement("span", null, getLabel(treeNode))),
            shouldShowChildren && children()));
    };
    return FunctionalFileTree;
}(React.Component));
exports.FunctionalFileTree = FunctionalFileTree;
function treeMapper(props, pathToNode, node, i) {
    return (React.createElement(FunctionalFileTree, __assign({ key: i }, props, { treeData: node, pathToNode: pathToNode.length > 0 ? pathToNode + "." + i : "" + i, isRoot: false })));
}
function localGetId(pathToNode, _) {
    return pathToNode;
}
function localGetStyle(_) {
    return {};
}
function localGetClassname(_) {
    return '';
}
function localGetLabelIcon(_) {
    return React.createElement(fa_3.FaFileCodeO, null);
}
function localGetFoldIcons(_) {
    return [React.createElement(fa_2.FaFolderOpen, { key: "0" }), React.createElement(fa_1.FaFolder, { key: "1" })];
}
function localOnClick(_) {
    return;
}
function localOnHover(_) {
    return;
}
function localSortChildren(children) {
    return children;
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=FunctionalFileTree.js.map