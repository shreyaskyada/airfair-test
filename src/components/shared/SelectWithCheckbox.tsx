import { Tag, Select, Divider, Checkbox, Typography } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';
import DropdownButtons from './DropdownButtons';
import { alignDropdownList } from '../../data/utils';
import useResize from '../../hooks/useResize';

interface SelectWithCheckboxProps {
  placeholder?: string;
  defaultValue?: string[];
  selectedValues: string[];
  mobilePlaceholder?: string;
  onApply: (value: string[]) => void;
  options: { value: string; label: ReactNode }[];
}

const { Text } = Typography;

const SelectWithCheckbox: FC<SelectWithCheckboxProps> = ({
  options,
  onApply,
  placeholder,
  selectedValues,
  defaultValue = [],
  mobilePlaceholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string[]>(defaultValue);

  useEffect(() => {
    setValue(selectedValues);
  }, [isOpen]);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const timer = setTimeout(() => {
      if (isOpen) {
        alignDropdownList(windowWidth);
      }
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  const { width } = useResize();

  return (
    <Select
      open={isOpen}
      value={value}
      mode='multiple'
      showSearch={false}
      maxTagCount='responsive'
      placeholder={width < 1000 ? mobilePlaceholder : placeholder}
      onChange={(t) => setValue(t)}
      className={`rounded-select w-full ${placeholder?.split(' ')[1]} `}
      onDropdownVisibleChange={(t) => setIsOpen(t)}
      popupClassName={`filters-select ${isOpen ? 'open' : ''}`}
      tagRender={({ value, closable, onClose }) => {
        const tags = options.find((el) => el.value === value);

        return tags ? (
          <Tag
            closable={closable}
            onClose={onClose}
            style={{
              marginRight: 3,
              paddingTop: 1,
              paddingBottom: 1,
              fontWeight: '500',
            }}
          >
            {tags.label}
          </Tag>
        ) : (
          <></>
        );
      }}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: '4px 0' }} />
          <DropdownButtons
            onReset={() => {
              setValue([]);
              onApply([]);
              setIsOpen(false);
            }}
            onApply={() => {
              onApply(value);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    >
      {options.map((el) => (
        <Select.Option key={el.value}>
          <Checkbox checked={value.includes(el.value)} />
          <Text style={{ marginLeft: '10px' }}>{el.label}</Text>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectWithCheckbox;
