import { forwardRef, useRef, useState } from "react";

export default function Test2() {
  const [headline, setHeadline] = useState("This is headline");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);
  const MybuttionClick1 = () => {
    console.log("1");
  };
  const MybuttionClick2 = () => {
    console.log("2");
  };
  return (
    <div>
      <h1>{headline}</h1>
      <button
        onClick={() => {
          setHeadline("Test2");
        }}
      >
        change headline
      </button>
      <MyButton
        ref={buttonRef}
        on={MybuttionClick1}
        name="button without forward"
      />
      <MyButton2
        ref={buttonRef2}
        on={MybuttionClick2}
        name="button with forward"
      />
    </div>
  );
}
type MyButtonProps = {
  name: string;
  on: () => void;
  ref?: React.Ref<HTMLButtonElement>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">;

function MyButton({ ref, ...props }: MyButtonProps) {
  const { on, name } = props;
  return (
    <button ref={ref} onClick={on}>
      {name}
    </button>
  );
}

// type MyButtonProps = {
//   name: string;
//   on: () => void;
// } & React.ButtonHTMLAttributes<HTMLButtonElement>;

const MyButton2 = forwardRef<HTMLButtonElement, MyButtonProps>((props, ref) => {
  const { name, on } = props;
  return (
    <button
      ref={ref}
      onClick={on}
      className="px-2 py-1 justify-around rounded-2xl  bg-blue-500 hover:bg-blue-600 text-base"
    >
      {name}
    </button>
  );
});
MyButton2.displayName = "MyButton2";
