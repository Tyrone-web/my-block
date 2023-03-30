import { useState, useEffect } from "react";
import styles from "./index.module.scss";

interface IProps {
  time: number;
  onEnd: () => void;
}
const CountDown = (props: IProps) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState(time || 60);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((count) => {
        if (count === 0) {
          onEnd();
          clearTimeout(timer);
          return count;
        }

        return count - 1;
      });

      return () => clearTimeout(timer);
    }, 1000);
  }, [count, onEnd]);

  return <span className={styles.countDown}>{count}</span>;
};

export default CountDown;
