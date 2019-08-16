import React from 'react';

import { renderElement } from './utils';

import { ICellRendererCBParam, IColumnRenderCallback, IColumnProps } from './Column';
import { IHeaderRendererParam } from './GridTable';

export interface ITableHeaderRowProps {
  isScrolling: boolean;
  className: string;
  style: React.CSSProperties,
  columns: IColumnProps[],
  headerIndex: number;
  cellRenderer: IColumnRenderCallback<ICellRendererCBParam>;
  headerRenderer: React.ComponentType<IHeaderRendererParam>;
  expandColumnKey: string;
  expandIcon: React.ElementType;
  tagName: React.ElementType;
};

/**
 * HeaderRow component for BaseTable
 */
const TableHeaderRow: React.FunctionComponent<ITableHeaderRowProps> = ({
  className,
  style,
  columns,
  headerIndex,
  cellRenderer,
  headerRenderer,
  expandColumnKey,
  expandIcon: ExpandIcon,
  tagName: Tag,
  ...rest
}) => {
  let cells = columns.map((column, columnIndex) =>
    cellRenderer({
      columns,
      column,
      columnIndex,
      headerIndex,
      expandIcon: column.key === expandColumnKey && <ExpandIcon />,
    })
  );

  if (headerRenderer) {
    cells = renderElement(headerRenderer, { cells, columns, headerIndex });
  }

  return (
    <Tag {...rest} className={className} style={style}>
      {cells}
    </Tag>
  );
};

TableHeaderRow.defaultProps = {
  tagName: 'div',
};

export default TableHeaderRow;
