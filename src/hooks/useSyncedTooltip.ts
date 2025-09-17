import { useState } from 'react';

export const useSyncedTooltip = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const handleMouseEnter = (index: number, data: any) => {
    setActiveIndex(index);
    setActiveData(data);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    setActiveData(null);
  };

  return {
    activeIndex,
    activeData,
    handleMouseEnter,
    handleMouseLeave
  };
};
