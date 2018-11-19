import { css, cx } from 'emotion';
import * as fp from 'lodash/fp';
import * as React from 'react';
import { FaFolder as FolderClosedIcon}  from 'react-icons/lib/fa/';
import { FaFolderOpen as FolderOpenIcon}  from 'react-icons/lib/fa/';
import { FaFileCodeO as FileIcon}  from 'react-icons/lib/fa/';
import { Node, NodeArray, TreeData, Icon, NodeId }  from '../types';

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

const labelClassname = css`
  cursor: pointer;
  padding: 1px 0;
  white-space: nowrap;
`;

const initState = {
  timeout: 0,
};
type State = Readonly<typeof initState>;
export class FunctionalFileTree<T> extends React.Component<Props<T>> {
  public readonly state: State = initState;

  public shouldComponentUpdate(
    { treeData: nextTree, shouldUpdate }: Props<T>,
    ): boolean {
    return shouldUpdate(this.props.treeData, nextTree);
  }

  public render(): JSX.Element {
    const {
      treeData,
      getChildren,
      isExpanded,
      isDirectory,
      getId = this._getId(),
      getStyle = localGetStyle,
      getClassname = localGetClassname,
      onClick = localOnClick,
      sortChildren = localSortChildren,
    } = this.props;
    /*
    getLabel
      Pass in a node, get a string to use the label that node. Use getId() if not provided.
    */
    const { getLabel = getId } = this.props;

    const pathToNode = this.getPathToNode();
    const curriedTreeMapper = fp.curry(treeMapper)(this.props)(pathToNode);
    if (fp.isArray(treeData)) {
      return (
        <>
          {sortChildren(treeData as NodeArray<T>).map(curriedTreeMapper)}
        </>
      );
    }

    const treeNode = treeData as T;
    const userClassname = getClassname(treeNode) || '';
    const { length } = this.getPathToNode().split('.');
    const functionalFileTreeClassname = css`
      padding-left: ${10 * length}px;
    `;
    const combinedClassname = cx(labelClassname, functionalFileTreeClassname, userClassname);

    const onNodeClick = () => onClick(getId(treeNode));
    const shouldShowChildren = isDirectory(treeNode) && isExpanded(treeNode);

    const children = () => <div>{sortChildren(getChildren(treeNode)).map(curriedTreeMapper)}</div>;
    return (
      <>
        <div
          style={getStyle(treeNode)}
          className={combinedClassname}
          onClick={onNodeClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <span>{this.getIcon(treeNode)}</span> <span>{getLabel(treeNode)}</span>
        </div>
        {shouldShowChildren && children()}
      </>
    );
  }

  private getPathToNode = () => {
    const { isRoot = true } = this.props;
    const { pathToNode = isRoot ? '' : '0' } = this.props;
    return pathToNode;
  }

  private _getId = (): (node: Node<T>) => NodeId => {
    return fp.curry(localGetId)(this.getPathToNode());
  }

  private onMouseEnter = () => {
    const {
      treeData,
      getId = this._getId(),
      onHover = localOnHover,
      hoverDelay = 0,
    } = this.props;
    if (!Array.isArray(treeData)) {
      this.setState({
        timeout: setTimeout(() => onHover(getId(treeData)), hoverDelay),
      });
    }
  }

  private onMouseLeave = () => {
    clearTimeout(this.state.timeout);
  }

  private getIcon = (node: Node<T>): Icon => {
    const { isDirectory } = this.props;
    if (!isDirectory(node)) {
      const { getLabelIcon = localGetLabelIcon } = this.props;
      return getLabelIcon(node);
    }
    const { isExpanded, getFoldIcons = localGetFoldIcons } = this.props;
    const [openIcon, closedIcon] = getFoldIcons(node);
    if (isExpanded(node)) {
      return openIcon;
    }
    return closedIcon;
  }
}

function treeMapper<T>(props: Props<T>, pathToNode: string, node: Node<T>, i: number): JSX.Element {
  return (
    <FunctionalFileTree
      key={i}
      {...props}
      treeData={node}
      pathToNode={pathToNode.length > 0 ? `${pathToNode}.${i}` : `${i}`}
      isRoot={false}
    />
  );
}

/*
treeData
  This is the core data being rendered.
  The only thing we access directly on this is whether it is an array or not,
  which determines whether the tree be displayed as a single root node, or a list of root nodes.
  Since all access is done though parameter functions,
  we don't need to know anything else about the data directly.

shouldUpdate
  Deep comparisons are expensive, so we leave it to the caller (application code)
  to determine whether the component should re-render based on new tree data.
  This allows us to provide the convenience of the caller component not needing to track state
  only for the purpose of implementing shouldComponentUpdate.

getChildren
  Pass in a node, get back a list of children of that node.
  This allows the underlying data structure to represent its children under any key it likes,
  or even to calculate them dynamically.
  Expect that you can call this recursively on any node returned,
  as well as on the top-level treeData
  (unless it is a list, in which case you can call it on each member of the list).

isDirectory
  Pass in a node, get back a boolean representing whether the node was a directory or not.

isExpanded
  If isDirectory returns true,
  call this with the node and determine via the boolean result whether the directory node
  should be displayed as expandedOrCollapsed
*/

/*
getId
  Pass in a node, get an id for that node. Expect that it is unique among nodes.
  Default behaviour would be to return a dot separated string representing
  the 0-indexed path to the node in the list.
  For example, "0.1.3" would represent the fourth child of the second child of the first top node.
*/
function localGetId<T>(pathToNode: string, _: Node<T>): string | number {
  return pathToNode;
}

/*
getStyle
  Pass in a node,
  get an object that can be assumed to be a valid React inline-style object or null.
  If non-null, set it to the local style for the FunctionalFileTree.
*/
function localGetStyle<T>(_: Node<T>): React.CSSProperties | undefined {
  return {};
}

/*
getClassname
  Pass in a node,
  get a string that can be assumed to be a valid EmotionJS css template string or null.
  If non-null, merge it with the default node css using cx.
*/
function localGetClassname<T>(_: Node<T>): string {
  return '';
}

/*
getLabelIcon
  Pass in a node, get back a HTMLSpanElement, HTMLImageElement, or void.
  Add this to the left of the label.
  Add nothing if void.
  If not passed use default icons for file and folder.
*/
function localGetLabelIcon<T>(_: Node<T>): Icon {
  return <FileIcon />;
}

/*
getFoldIcons
  Like above, but get icons for both toggled and non-toggled.
  Use defaults if function is not provided as prop.
  If function returns void, add no fold icon.
*/
function localGetFoldIcons<T>(_: Node<T>): [Icon, Icon]  {
  return [<FolderOpenIcon key="0" />, <FolderClosedIcon key="1" />];
}

/*
onClick
  Call with the node id that is clicked.
*/
function localOnClick(_: NodeId): void {
  return;
}

/*
onHover
  Call with the node id that is hovered after a timeout of the configured hover delay.
  Debounce all hovers in the delay. Use a default delay 0.
*/
function localOnHover(_: NodeId): void {
  return;
}

/*
sortChildren
  Call with a Node[] (representing the children of a Node or an array of root Nodes),
  get back that Node[] sorted.
*/
function localSortChildren<T>(children: NodeArray<T>): NodeArray<T> {
  return children;
}
