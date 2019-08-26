import React from 'react';
import cn from 'classnames';
import { FixedSizeGrid as Grid, GridOnItemsRenderedProps, Align, FixedSizeGridProps } from 'react-window';

import { IOnRowsRenderedParam, RendererArgs } from './BaseTable';
import Header from './TableHeader';
import { IColumnProps } from './Column'

/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends React.PureComponent<GridTableProps> {
  private bodyRef?: Grid;
  private headerRef?: Header;
  public forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  public scrollToPosition(args: {scrollLeft: number, scrollTop: number}) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
  }

  public scrollToTop(scrollTop: number) {
    this.bodyRef && this.bodyRef.scrollTo({ scrollTop, scrollLeft: 0 });
  }

  public scrollToLeft(scrollLeft: number) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo({ scrollLeft, scrollTop: 0 });
  }

  scrollToRow(rowIndex = 0, align: Align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, columnIndex: 0, align });
  }

  public renderRow: FixedSizeGridProps['children'] = (args) => {
    const { data, columns, rowRenderer: RowRenderer } = this.props;
    const rowData = data[args.rowIndex];
    const newProps: RendererArgs = { ...args, columns, rowData };
    return <RowRenderer {...newProps}/>;
  }

  render() {
    const {
      containerStyle,
      classPrefix,
      className,
      data,
      frozenData,
      width,
      height,
      rowHeight,
      headerWidth,
      bodyWidth,
      useIsScrolling,
      onScroll,
      hoveredRowKey,
      overscanRowCount,
      // omit from rest
      style,
      onScrollbarPresenceChange,
      ...rest
    } = this.props;
    const headerHeight = this._getHeaderHeight();
    const frozenRowCount = frozenData.length;
    const frozenRowsHeight = rowHeight * frozenRowCount;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    return (
      <div role="table" className={cls} {...containerProps}>
        <Grid
          {...rest}
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          itemKey={this._itemKey}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={rowHeight}
          rowCount={data.length}
          overscanRowCount={overscanRowCount}
          columnWidth={bodyWidth}
          columnCount={1}
          overscanColumnCount={0}
          useIsScrolling={useIsScrolling}
          onScroll={onScroll}
          onItemsRendered={this._handleItemsRendered}
          children={this.renderRow}
        />
        {headerHeight + frozenRowsHeight > 0 && (
          // put header after body and reverse the display order via css
          // to prevent header's shadow being covered by body
          <Header
            {...rest}
            className={`${classPrefix}__header`}
            ref={this._setHeaderRef}
            data={data}
            frozenData={frozenData}
            width={width}
            height={Math.min(headerHeight + frozenRowsHeight, height)}
            rowWidth={headerWidth}
            rowHeight={rowHeight}
            headerHeight={this.props.headerHeight}
            headerRenderer={this.props.headerRenderer}
            rowRenderer={this.props.rowRenderer}
            hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
          />
        )}
      </div>
    );
  }

  private _setHeaderRef = (ref: Header) => {
    this.headerRef = ref;
  }

  private _setBodyRef = (ref: Grid) => {
    this.bodyRef = ref;
  }

  private _itemKey = ({ rowIndex }: {
    rowIndex: number;
  }): string | number => {
    const { data, rowKey } = this.props;
    return data[rowIndex][rowKey];
  }

  private _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  private _handleItemsRendered = ({
    overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    this.props.onRowsRendered({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex,
    });
  }
}

type TBaseGridTableProps = Omit<FixedSizeGridProps, 'rowCount' | 'overscanColumnCount' | 'columnCount' | 'children' |
  'columnWidth' >;
export interface GridTableProps<T = any> extends TBaseGridTableProps {
  containerStyle?: React.CSSProperties;
  classPrefix?: string;
  headerHeight?: number | number [];
  headerWidth?: number;
  bodyWidth?: number;
  columns?: IColumnProps[];
  data?: T[];
  rowKey?: string | number;
  frozenData?: T[];
  overscanRowCount?: number;
  hoveredRowKey?: string | number;
  onScrollbarPresenceChange?: (params: IOnScrollbarPresenceChange)=> void;
  onRowsRendered?: (param: IOnRowsRenderedParam) => void;
  headerRenderer: React.ComponentType<IHeaderRendererParam>;
  rowRenderer: React.ComponentType<RendererArgs>;
  children?: React.ReactElement<IColumnProps>[];
};

interface IOnScrollbarPresenceChange {
  size: number;
  horizontal: boolean;
  vertical: boolean;
}

export interface IHeaderRendererParam {
  cells?: any;
  columns?: IColumnProps[];
  style?: React.CSSProperties;
  headerIndex?: number;
}

export default GridTable;
