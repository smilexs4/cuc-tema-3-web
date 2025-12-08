import { useEffect, useState } from "react";

const getSecond = (time) => {
  const endDate = new Date();
  return Number.parseInt(
    ((endDate.getTime() - time.getTime()) / 1000).toFixed(),
    10
  );
};

export const CallTimer = (props) => {
  const { startAt, isEnd } = props;
  const [second, setSecond] = useState(getSecond(startAt));
  useEffect(() => {
    if (!isEnd) {
      const intervalId = setInterval(() => {
        setSecond(getSecond(startAt));
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isEnd, startAt]);
  return <span>{new Date(second * 1000).toISOString().slice(14, 19)}</span>;
};
