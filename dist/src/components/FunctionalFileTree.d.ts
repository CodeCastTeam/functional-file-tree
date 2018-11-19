import * as React from 'react';
import { Node, NodeArray, TreeData, Icon, NodeId } from '../types';
export interface Props<T> {
    treeData: TreeData<T>;
    shouldUpdate: (prevTreeData: TreeData<T>, nextTreeData: TreeData<T>) => boolean;
    getChildren: (node: Node<T>) => NodeArray<T>;
    isExpanded: (node: Node<T>) => boolean;
    isDirectory: (node: Node<T>) => boolean;
    getId?: (node: Node<T>) => NodeId;
    getLabel?: (node: Node<T>) => string;
    getStyle?: (node: Node<T>) => React.CSSProperties | undefined;
    getClassname?: (node: Node<T>) => string | void;
    getLabelIcon?: (node: Node<T>) => Icon;
    getFoldIcons?: (node: Node<T>) => [Icon, Icon];
    onClick?: (id: NodeId) => void;
    onHover?: (id: NodeId) => void;
    sortChildren?: (children: NodeArray<T>) => NodeArray<T>;
    hoverDelay?: number;
    pathToNode?: string;
    isRoot?: boolean;
}
declare const initState: {
    timeout: number;
};
declare type State = Readonly<typeof initState>;
export declare class FunctionalFileTree<T> extends React.Component<Props<T>> {
    readonly state: State;
    shouldComponentUpdate({ treeData: nextTree, shouldUpdate }: Props<T>): boolean;
    render(): JSX.Element;
    private getPathToNode;
    private _getId;
    private onMouseEnter;
    private onMouseLeave;
    private getIcon;
}
export {};
