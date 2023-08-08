import { useState, useEffect, RefObject } from "react";

export const useDimensions = (parentRef: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!parentRef.current) {
      return;
    }

    const element = parentRef.current;

    function outputSize() {
      setWidth(element.offsetWidth);
      setHeight(element.offsetHeight);
    }

    const resizeObserver = new ResizeObserver(outputSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [parentRef]);

  return [height, width] as const;
};