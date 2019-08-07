import React, { useState, forwardRef, useImperativeHandle } from 'react';

export const KEY_CODE_ENTER = 13;
export interface IQuickTextFilter {
  filter?: string;
  quickFilterPlaceholder?: string;
  onQuickFilterChanged: (filter: string | undefined) => void;
}
export interface QuickTextFilterHandler {
  reset: () => void;
}

const QuickTextFilter: React.RefForwardingComponent<QuickTextFilterHandler, IQuickTextFilter> = (props, ref) => {
  const { onQuickFilterChanged, quickFilterPlaceholder = 'Search by keyword' } = props;
  const [filter, setFilter] = useState(props.filter);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.which || event.keyCode;
    if (key === KEY_CODE_ENTER) {
      onQuickFilterChanged(filter);
    }
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      setFilter('');
    },
  }));

  return (
    <input
      className="ag-custom-panel-filter-quicktext"
      type="text"
      value={filter}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={quickFilterPlaceholder}
    />
  );
};

export default forwardRef(QuickTextFilter);
