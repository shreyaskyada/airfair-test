import { Button } from 'antd';
import { FC } from 'react';

interface DropdownButtonsProps {
  onReset: () => void;
  onApply: () => void;
}

const DropdownButtons: FC<DropdownButtonsProps> = ({ onApply, onReset }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button type='text' onClick={onReset}>
        RESET
      </Button>
      <Button type='primary' className='filter-button' onClick={onApply}>
        APPLY
      </Button>
    </div>
  );
};

export default DropdownButtons;
