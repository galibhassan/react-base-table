import React from 'react';
import { renderElement } from './utils';
import { IRowRendererCBParam, IRenderExpandIcon, IOnRowHover, IOnRowExpandCBParam, ICellProps } from './BaseTable';
import { ICellRendererCBParam, IColumnEssential, IRowEssential } from './Column';

type handlerArgs = { rowData: any, rowIndex: number, rowKey: string | number, event: Event };
export type handlerCollection = {[key: string]: (args: handlerArgs) => void};

export interface ITableRowProps extends IColumnEssential, IRowEssential {
  isScrolling: boolean;
  className: string;
  style: React.CSSProperties;
  expandIcon: React.ElementType;
  rowKey: number;
  expandColumnKey: string;
  depth?: number;
  rowEventHandlers?: handlerCollection;
  rowRenderer: React.ComponentType<IRowRendererCBParam>;
  cellRenderer: React.ComponentType<ICellRendererCBParam>;
  expandIconRenderer: React.ComponentType<IRenderExpandIcon>;
  onRowHover: (args: IOnRowHover) => void;
  onRowExpand: (args: IOnRowExpandCBParam) => any;
  tagName: React.ElementType;
};

/**
 * Row component for BaseTable
 */
class TableRow extends React.PureComponent<ITableRowProps> {
  public render() {
    /* eslint-disable no-unused-vars */
    const {
      isScrolling,
      className,
      style,
      column,
      columns,
      columnIndex,
      rowIndex,
      rowData,
      expandColumnKey,
      depth,
      rowEventHandlers,
      rowRenderer,
      cellRenderer: CellRenderer,
      expandIconRenderer: ExpandIconRenderer,
      tagName: Tag,
      // omit the following from rest
      rowKey,
      onRowHover,
      onRowExpand,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const expandIconProps: IRenderExpandIcon = { rowData, rowIndex, depth, onExpand: this.handleExpand };
    const expandIcon = <ExpandIconRenderer {...expandIconProps}/>;

    const cellProps: ICellProps = {
      isScrolling, 
      columns, 
      column, 
      columnIndex, 
      rowData, 
      rowIndex, 
      expandIcon: column.key === expandColumnKey && expandIcon,
    }

    
    let cells = columns.map((column, columnIndex) => { 
      return <CellRenderer {...cellProps} /> 
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
    onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey });
  }

  private getEventHandlers = (handlers: handlerCollection = {}) => {
    const { rowData, rowIndex, rowKey, onRowHover } = this.props;
    const eventHandlers: {[key:string]: (event:Event) =>  void} = {};
    Object.keys(handlers).forEach(eventKey => {
      const callback = handlers[eventKey];
      if (typeof callback === 'function') {
        eventHandlers[eventKey] = event => {
          callback({ rowData, rowIndex, rowKey, event });
        };
      }
    });

    if (onRowHover) {
      const mouseEnterHandler = eventHandlers['onMouseEnter'];
      eventHandlers['onMouseEnter'] = event => {
        onRowHover({
          hovered: true,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        mouseEnterHandler && mouseEnterHandler(event);
      };

      const mouseLeaveHandler = eventHandlers['onMouseLeave'];
      eventHandlers['onMouseLeave'] = event => {
        onRowHover({
          hovered: false,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        mouseLeaveHandler && mouseLeaveHandler(event);
      };
    }

    return eventHandlers;
  }
  public static defaultProps = {
    tagName: 'div',
  };
}


export default TableRow;
