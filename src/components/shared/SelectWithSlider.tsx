import { Divider, Select, Slider, Typography } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';
import DropdownButtons from './DropdownButtons';
import { alignDropdownList } from '../../data/utils';
import useResize from '../../hooks/useResize';

interface SelectWithSliderProps {
  max: number;
  min: number;
  placeholder?: string;
  selectLabel: ReactNode;
  mobilePlaceholder?: string;
  selectedValues: [number, number] | [];
  onChange: (t: [number, number] | []) => void;
}

const { Text } = Typography;

const SelectWithSlider: FC<SelectWithSliderProps> = ({
  max,
  min,
  onChange,
  placeholder,
  selectLabel,
  selectedValues,
  mobilePlaceholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<[number, number]>([min, max]);

  const option = [
    {
      value: 'a',
      label: selectLabel,
    },
  ];

  useEffect(() => {
    setValue(selectedValues.length ? selectedValues : [min, max]);
  }, [selectedValues, isOpen]);

  const { width } = useResize();

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

  return (
    <Select
      open={isOpen}
      options={option}
      showSearch={false}
      placeholder={width < 1000 ? mobilePlaceholder : placeholder}
      value={selectLabel ? option : null}
      onDropdownVisibleChange={(t) => setIsOpen(t)}
      popupClassName={`filters-select ${isOpen ? 'open' : ''}`}
      className={`rounded-select w-full ${placeholder?.split(' ')[1]} `}
      dropdownRender={() => {
        return (
          <div
            style={{
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '10px',
                paddingRight: '20px',
                width: '100%',
              }}
            >
              <Slider
                style={{
                  width: '100%',
                }}
                range={{ draggableTrack: true }}
                min={min}
                max={max}
                value={value}
                onChange={(t:any) => setValue(t)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>₹{min}</Text>
                <Text style={{ marginLeft: '-10px' }}>₹{max}</Text>
              </div>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <DropdownButtons
              onReset={() => {
                onChange([]);
                setValue([min, max]);
                setIsOpen(false);
              }}
              onApply={() => {
                onChange(value);
                setIsOpen(false);
              }}
            />
          </div>
        );
      }}
    />
  );
};

export default SelectWithSlider;
