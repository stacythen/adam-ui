/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FILTER_TYPE, FilterModel } from './FilterProps';
import { SortModel } from './SortProps';
import findKey from 'lodash/findKey';
import { DateFilterModel, TextFilterModel, NumberFilterModel } from 'ag-grid-community';

interface SortOptionsMap {
  asc: string;
  desc: string;
}

/** Filter Options: https://www.ag-grid.com/javascript-grid-filter-provided-simple/ */
interface FilterOptionsMap {
  contains: string;
  notContains: string;
  equals: string;
  notEqual: string;
  startsWith: string;
  endsWith: string;
  lessThan: string;
  lessThanOrEqual: string;
  greaterThan: string;
  greaterThanOrEqual: string;
  inRange: string;
  empty: string;
}

class DataGridMapperConfiguration {
  //#region Private Variables

  private sortOptionsMap: SortOptionsMap | null = null;
  private sortPropertyField: string | null = null;
  private sortDirectionField: string | null = null;

  private filterOptionsMap: Partial<FilterOptionsMap> | null = null;
  private filterPropertyField: string | null = null;
  private filterOperatorField: string | null = null;
  private filterValueField: string | null = null;

  private dateParser: ((date: string) => string | Date) | null = null;
  private dateFormatter: ((date: string) => string | Date) | null = null;

  //#endregion

  //#region Configuration Methods

  public configureSortMap = <T>(
    sortOptionsMap: SortOptionsMap,
    propertyField: keyof T & string,
    directionField: keyof T & string
  ): DataGridMapperConfiguration => {
    this.sortOptionsMap = sortOptionsMap;
    this.sortPropertyField = propertyField;
    this.sortDirectionField = directionField;
    return this;
  };

  public configureFilterMap = <T>(
    filterOptionsMap: Partial<FilterOptionsMap>,
    propertyField: keyof T & string,
    operatorField: keyof T & string,
    valueField: keyof T & string
  ): DataGridMapperConfiguration => {
    this.filterOptionsMap = filterOptionsMap;
    this.filterPropertyField = propertyField;
    this.filterOperatorField = operatorField;
    this.filterValueField = valueField;
    return this;
  };

  /** ag-grid date filter format is always YYYY-MM-DD eg 2019-05-24 value
   * parse filter date value to restful date format (Date or String)
   */
  public setDateParser = (parseDate: (date: string) => string | Date) => {
    this.dateParser = parseDate;
  };

  /** ag-grid date filter format is always YYYY-MM-DD eg 2019-05-24 value
   * format restful date to filter date value (string format YYYY-MM-DD)
   */
  public setDateFormatter = (formatDate: (date: string | Date) => string) => {
    this.dateFormatter = formatDate;
  };

  //#endregion

  //#region Private Methods

  private checkSortMapNotNull = () => {
    if (this.sortPropertyField === null || this.sortDirectionField === null || !this.sortOptionsMap === null) {
      throw new Error('Please configure Sort Map');
    }
  };

  private checkFilterMapNotNull = () => {
    if (
      this.filterPropertyField === null ||
      this.filterOperatorField === null ||
      this.filterValueField === null ||
      this.filterOptionsMap === null
    ) {
      throw new Error('Please configure Filter Map');
    }
  };

  private parseFilterByFilterType = (filterModel: TextFilterModel | NumberFilterModel | DateFilterModel) => {
    switch (filterModel.type) {
      case FILTER_TYPE.date: {
        const eFilterModel = filterModel as DateFilterModel;
        return this.dateParser && typeof eFilterModel.dateFrom === 'string'
          ? this.dateParser(eFilterModel.dateFrom)
          : eFilterModel.dateFrom;
      }
      case FILTER_TYPE.number: {
        const eFilterModel = filterModel as NumberFilterModel;
        return eFilterModel.filter;
      }
      default: {
        const eFilterModel = filterModel as TextFilterModel;
        return eFilterModel.filter;
      }
    }
  };

  private formatFilterByFilterType = (filterType: string, operator: string, filter: string | number) => {
    if (filterType === FILTER_TYPE.date) {
      return {
        filterType: filterType,
        type: findKey(this.filterOptionsMap, v => v === operator),
        dateFrom: this.dateFormatter && typeof filter === 'string' ? this.dateFormatter(filter) : filter,
      };
    } else {
      return {
        filterType: filterType,
        type: findKey(this.filterOptionsMap, v => v === operator),
        filter: filter,
      };
    }
  };

  private getFilterTypeByFilter = (filter: string | number | Date) => {
    if (typeof filter === 'number') {
      return FILTER_TYPE.number;
    } else if (filter instanceof Date || /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/i.test(filter)) {
      //YYYY-MM-DD
      return FILTER_TYPE.date;
    } else {
      return FILTER_TYPE.text;
    }
  };

  //#endregion

  //#region Public Methods

  public restfulToSortModel = <T>(object: T[] | undefined): SortModel[] | undefined => {
    this.checkSortMapNotNull();
    return object
      ? object.map<any>(c => {
          return {
            colId: c[this.sortPropertyField!],
            sort: findKey(this.sortOptionsMap, v => v === String(c[this.sortDirectionField!])),
          };
        })
      : undefined;
  };

  public restfulToFilterModel = <T>(object: T[] | undefined): FilterModel | undefined => {
    this.checkFilterMapNotNull();
    let result: FilterModel = {};

    if (object) {
      const filterType = this.getFilterTypeByFilter(this.filterValueField!);
      result = object.reduce<any>((curr, c) => {
        return {
          ...curr,
          [c[this.filterPropertyField!]]: this.formatFilterByFilterType(
            filterType,
            c[this.filterOperatorField!],
            c[this.filterValueField!]
          ),
        };
      }, result);
      return result;
    } else {
      return undefined;
    }
  };

  public sortModelToRestful = <T>(object: SortModel[] | undefined): T[] | undefined => {
    this.checkSortMapNotNull();
    return object
      ? object.map<any>(c => {
          return {
            [this.sortPropertyField!]: c.colId,
            [this.sortDirectionField!]: this.sortOptionsMap![c.sort],
          };
        })
      : undefined;
  };

  public filterModelToRestful = <T>(object: FilterModel | undefined): T[] | undefined => {
    this.checkFilterMapNotNull();
    return object
      ? Object.keys(object).map<any>(key => {
          return {
            [this.filterPropertyField!]: key,
            [this.filterOperatorField!]: this.filterOptionsMap![object[key].type],
            [this.filterValueField!]: this.parseFilterByFilterType(object[key]),
          };
        })
      : undefined;
  };

  //#endregion
}

export default DataGridMapperConfiguration;
