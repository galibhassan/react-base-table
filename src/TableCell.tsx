import React from 'react';
import { toString } from './utils';
import { IColumnProps, IRowEssential, RowDataType } from './Column';

export interface TableCellProps<T=RowDataType> extends IRowEssential<T>{
  className: string;
  cellData: any;
  column: IColumnProps;
  columnIndex: number;
}

/**
 * Cell component for BaseTable
 */
export type TTableCell<T=any> = React.FunctionComponent<React.HTMLProps<HTMLDivElement> & TableCellProps<T>>;
const TableCell: TTableCell =
({ className, cellData, column, columnIndex, rowData, rowIndex }) => (
  <div className={className}>{React.isValidElement(cellData) ? cellData : toString(cellData)}</div>
);


export default TableCell;
