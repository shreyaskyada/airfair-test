import { AutoComplete, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { SelectHandler } from 'rc-select/lib/Select';
import React, { useEffect } from 'react';

const { TextArea } = Input;

const CustomAutoComplete: React.FC<{
  onSearch?: (val: string) => void;
  onSelect?: SelectHandler<any, DefaultOptionType>;
  options?: DefaultOptionType[];
  onBlur?: () => void;
  onOpen?: () => void;
}> = ({ onBlur, onSearch, onSelect, options, onOpen }) => {
  useEffect(() => {
    onOpen && onOpen();
  }, []);

  return (
    <AutoComplete
      autoFocus
      allowClear
      style={{ width: '100%', height: 'calc(100% - 20px)' }}
      defaultValue=''
      placeholder='From field'
      onSearch={onSearch}
      onSelect={onSelect}
      options={options}
      open
    >
      <TextArea onBlur={onBlur} autoSize={{ minRows: 5, maxRows: 8 }} />
    </AutoComplete>
  );
};

export default CustomAutoComplete;
