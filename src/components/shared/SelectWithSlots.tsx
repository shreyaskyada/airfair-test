import { Divider, Select, Tag, Typography } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';
import DropdownButtons from './DropdownButtons';
import { alignDropdownList } from '../../data/utils';
import useResize from '../../hooks/useResize';

interface SelectWithSlotsProps {
  hasReturn: boolean;
  originLabel: string;
  returnLabel: string;
  placeholder?: string;
  selectLabel: ReactNode;
  mobilePlaceholder?: string;
  options: { label: ReactNode; value: string }[];
  onApply: (originValues: string[], returnValues: string[]) => void;
  selectedValues: { originFlights: string[]; returnFlights: string[] };
}

const { CheckableTag } = Tag;
const { Text } = Typography;

const SelectWithSlots: FC<SelectWithSlotsProps> = ({
  options,
  onApply,
  hasReturn,
  placeholder,
  selectLabel,
  originLabel,
  returnLabel,
  selectedValues,
  mobilePlaceholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [originFlightValues, setOriginFlightValues] = useState<string[]>([]);
  const [returnFlightValues, setReturnFlightValues] = useState<string[]>([]);

  const handleChange = (p: string[], tag: string, checked: boolean) => {
    if (checked) {
      return [...p, tag];
    }
    return [...p].filter((t) => t !== tag);
  };

  const getTag = (
    tag: { value: string; label: ReactNode },
    selectedState: string[],
    onChange: (checked: boolean) => void
  ) => (
    <CheckableTag
      key={tag.value}
      checked={selectedState.includes(tag.value)}
      onChange={onChange}
      style={{
        padding: '3px 6px',
        margin: '8px',
        ...(selectedState.includes(tag.value)
          ? {}
          : {
              backgroundColor: 'rgba(0,0,0,0.05)',
            }),
      }}
    >
      {tag.label}
    </CheckableTag>
  );

  useEffect(() => {
    setOriginFlightValues(selectedValues.originFlights);
    setReturnFlightValues(selectedValues.returnFlights);
  }, [selectedValues, isOpen]);

  const option = [
    {
      value: 'a',
      label: selectLabel,
    },
  ];

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
      options={option}
      showSearch={false}
      placeholder={width < 1000 ? mobilePlaceholder : placeholder}
      className={`rounded-select w-full ${placeholder?.split(' ')[1]} `}
      value={selectLabel ? option : null}
      onDropdownVisibleChange={(t) => setIsOpen(t)}
      popupClassName={`filters-select ${isOpen ? 'open' : ''}`}
      dropdownRender={() => {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '100%',
              }}
            >
              <div
                style={{
                  borderRight: hasReturn ? '1px solid rgba(0,0,0,0.04)' : 0,
                }}
              >
                <Text style={{ padding: '10px', display: 'block' }}>
                  {originLabel}
                </Text>
                <div>
                  {options.map((tag) =>
                    getTag(tag, originFlightValues, (checked) => {
                      setOriginFlightValues((p) =>
                        handleChange(p, tag.value, checked).sort((a, b) => {
                          const idx = options.findIndex((t) => t.value === a);
                          const jdx = options.findIndex((t) => t.value === b);

                          if (idx < jdx) return -1;
                          else return 1;
                        })
                      );
                    })
                  )}
                </div>
              </div>
              {hasReturn && (
                <div>
                  <Text style={{ padding: '10px', display: 'block' }}>
                    {returnLabel}
                  </Text>
                  <div>
                    {options.map((tag) =>
                      getTag(tag, returnFlightValues, (checked) => {
                        setReturnFlightValues((p) =>
                          handleChange(p, tag.value, checked).sort((a, b) => {
                            const idx = options.findIndex((t) => t.value === a);
                            const jdx = options.findIndex((t) => t.value === b);

                            if (idx < jdx) return -1;
                            else return 1;
                          })
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <DropdownButtons
              onReset={() => {
                onApply([], []);
                setIsOpen(false);
              }}
              onApply={() => {
                setIsOpen(false);
                onApply(originFlightValues, returnFlightValues);
              }}
            />
          </div>
        );
      }}
    />
  );
};

export default SelectWithSlots;
