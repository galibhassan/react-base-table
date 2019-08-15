import React from 'react';
import { IHeaderRendererParam } from './GridTable'
import { IColumnProps } from './Column';
import { RendererArgs } from './BaseTable';

export interface TableHeaderProps<T = any> {
  className?: string;
  width: string | number;
  height: string | number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number | string;
  columns: IColumnProps[];
  data: T[],
  frozenData?: T[],
  headerRenderer: React.ComponentType<IHeaderRendererParam>;
  rowRenderer: React.ComponentType<RendererArgs>;
  hoveredRowKey: any;
};

class TableHeader extends React.PureComponent<TableHeaderProps> {

  private headerRef: HTMLDivElement;
  
  public scrollTo(offset: number) {
    if (this.headerRef) this.headerRef.scrollLeft = offset;
  }

  public renderHeaderRow = (height: number, index: number) => {
    const { columns, headerRenderer } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties = { width: '100%', height };
    return headerRenderer({ style, columns, headerIndex: index });
  }

  public renderFrozenRow = (rowData: any, index: number) => {
    const { columns, rowHeight, rowRenderer } = this.props;
    const style = { width: '100%', height: rowHeight };
    // for frozen row the `rowIndex` is negative
    const rowIndex = -index - 1;
    return rowRenderer({ style, columns, rowData, rowIndex });
  }

  public render() {
    const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties= {
      width,
      height: height,
      position: 'relative',
      overflow: 'hidden',
    };

    const innerStyle: React.CSSProperties = {
      width: rowWidth,
      height,
    };

    const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
    return (
      <div role="grid" ref={this._setRef} className={className} style={style}>
        <div role="rowgroup" style={innerStyle}>
          {rowHeights.map(this.renderHeaderRow)}
          {frozenData.map(this.renderFrozenRow)}
        </div>
      </div>
    );
  }

  private _setRef = (ref: HTMLDivElement) => {
    this.headerRef = ref;
  }
}

export default TableHeader;
