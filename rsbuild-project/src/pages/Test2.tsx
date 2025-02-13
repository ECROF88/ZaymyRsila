import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export default function Test2() {
  const childRef = useRef(null);

  const Reset = () => {
    childRef.current?.reset();
  };

  return (
    <>
      <div className="flex-col justify-around gap-1">
        <h1 className="text-lg text-pink-300">This is father</h1>
      </div>
      <Child ref={childRef} />
      <button onClick={Reset}>ClickToReset</button>
      <button
        type="button"
        onClick={() => {
          console.log(childRef.current);
        }}
      >
        showRef
      </button>
    </>
  );
}

interface ChildRef {
  count: number;
  reset: (value: number) => void;
}

interface ChildProps {
  ref?: React.Ref<ChildRef>;
}

const Child = (props: ChildProps) => {
  const [count, setCount] = useState(0);
  useImperativeHandle(
    props.ref,
    () => {
      console.log("执行回调");
      return {
        count,
        reset: () => setCount(0),
      };
    },
    [count],
  );

  return (
    <div className="flex bg-amber-50 ">
      <div className="my-4 border-4 border-amber-400"></div>
      <p className="text-2xl text-blue-200 py-4 px-4 ">count is: {count}</p>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        click to add
      </button>
    </div>
  );
};
