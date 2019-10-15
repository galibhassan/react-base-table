import React from 'react';
import { ICellProps, IOnRowExpandCBParam, IOnRowHover, IRenderExpandIcon, IRowRendererCBParam } from './BaseTable';
import { ICellRendererCBParam, IColumnProps, RowDataType } from './Column';
import { renderElement } from './utils';

interface HandlerArgs {
  rowData: RowDataType;
  rowIndex: number;
  rowKey: React.Key;
  event: Event;
}
export interface THandlerCollection {
  [key: string]: (args: HandlerArgs) => void;
}

export interface ITableRowProps<T = RowDataType> {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: IColumnProps[];
  rowData: T;
  rowIndex: number;
  rowKey?: React.Key;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: THandlerCollection;
  rowRenderer?: React.ElementType<IRowRendererCBParam> | React.ReactElement;
  cellRenderer?: (props: ICellRendererCBParam<T>) => React.ReactNode;
  expandIconRenderer?: React.ElementType<IRenderExpandIcon<T>>;
  onRowHover?: (args: IOnRowHover) => void;
  onRowExpand?: (args: IOnRowExpandCBParam) => any;
  tagName?: React.ElementType;
}

/**
 * Row component for BaseTable
 */
class TableRow<T = any> extends React.PureComponent<ITableRowProps<T>> {
  public static defaultProps = {
    tagName: 'div',
  };
  public render() {
    /* eslint-disable no-unused-vars */
    const {
      isScrolling,
      className,
      style,
      columns,
      rowIndex,
      rowData,
      expandColumnKey,
      depth,
      rowEventHandlers,
      rowRenderer,
      cellRenderer,
      expandIconRenderer: ExpandIconRenderer,
      tagName: Tag,
      // omit the following from rest
      rowKey,
      onRowHover,
      onRowExpand,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const expandIconProps: IRenderExpandIcon<T> = { rowData, rowIndex, depth, onExpand: this.handleExpand };
    const expandIcon = <ExpandIconRenderer {...expandIconProps} />;

    let cells: React.ReactNode = columns.map((column, columnIndex) => {
      const cellProps: ICellProps<T> = {
        isScrolling,
        columns,
        column,
        columnIndex,
        rowData,
        rowIndex,
        expandIcon: column.key === expandColumnKey && expandIcon,
      };
      return cellRenderer({...cellProps});
    });

    if (rowRenderer) {
      cells = renderElement(rowRenderer, { isScrolling, cells, columns, rowData, rowIndex, depth });
    }

    const eventHandlers = this.getEventHandlers(rowEventHandlers);

    return (
      <Tag {...rest} className={className} style={style} {...eventHandlers}>
        {cells}
      </Tag>
    );
  }

  private handleExpand = (expanded: string[]) => {
    const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
    if (onRowExpand) { onRowExpand({ expanded, rowData, rowIndex, rowKey }); }
  }

  private getEventHandlers = (handlers: THandlerCollection = {}) => {
    const { rowData, rowIndex, rowKey, onRowHover } = this.props;
    const eventHandlers: { [key: string]: (event: Event) => void } = {};
    Object.keys(handlers).forEach((eventKey) => {
      const callback = handlers[eventKey];
      if (typeof callback === 'function') {
        eventHandlers[eventKey] = (event) => {
          callback({ rowData, rowIndex, rowKey, event });
        };
      }
    });

    if (onRowHover) {
      const mouseEnterHandler = eventHandlers.onMouseEnter;
      eventHandlers.onMouseEnter = (event) => {
        onRowHover({
          hovered: true,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        if ( mouseEnterHandler ) { mouseEnterHandler(event); }
      };

      const mouseLeaveHandler = eventHandlers.onMouseLeave;
      eventHandlers.onMouseLeave = (event) => {
        onRowHover({
          hovered: false,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        if (mouseLeaveHandler) { mouseLeaveHandler(event); }
      };
    }

    return eventHandlers;
  }
}

export default TableRow;
