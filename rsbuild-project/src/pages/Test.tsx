import React, { createContext, useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import dayjs from "dayjs";
import ScrollableTable from "../component/ScrollableTable";
import { useCatStore } from "@/utils/store";
interface User {
  id: number;
  rid: number;
  content: string;
}
const MyContext = createContext("");

const initialUsers: User[] = [
  { id: 1, rid: 3, content: "a" },
  { id: 2, rid: 2, content: "b" },
  { id: 3, rid: 1, content: dayjs(new Date()).format("MM-DD hh:mm:ss") },
];
export default function Test() {
  const navigate = useNavigate();
  const [list, setList] = useState<User[]>(initialUsers);
  const [type, setType] = useState<"id" | "rid">("id");
  const handleChange = (type: "id" | "rid") => {
    // console.dir(ref1.current);
    console.log(type);
    setType(type);
    const sortedlist = sortlist([...list], type);
    setList(sortedlist);
  };
  const sortlist = (data: User[], sortby: string) => {
    return data.sort((a, b) => {
      let compareValue = 0;
      if (sortby === "id") {
        compareValue = a.id - b.id;
      } else if (sortby === "rid") {
        compareValue = a.rid - b.rid;
      }
      return compareValue;
    });
  };

  const [addcon, setAddcon] = useState("");
  const additem = () => {
    const newUser: User = {
      id: list.length + 1,
      rid: Math.floor(Math.random() * 100),
      content: addcon,
    };
    setList(sortlist([...list, newUser], type));
    setAddcon("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleDel = (id: number) => {
    setList(list.filter((item) => item.id !== id));
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const getSonMsg = (msg: string) => {
    setMsg(msg);
  };
  const bigCats = useCatStore.use.cats;
  const b = bigCats().bigCats;
  return (
    <div className="p-4">
      {/* <ScrollableTable /> */}
      <Game />
      <div>
        <input
          id="addcon"
          name="addcon"
          value={addcon}
          onChange={(e) => setAddcon(e.target.value)}
          ref={inputRef}
        ></input>
        <button type="button" onClick={additem}>
          click
        </button>
      </div>
      <div className="mb-4 space-x-4">
        <button
          className={`px-4 py-2 rounded ${type === "id" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleChange("id")}
        >
          按ID排序
        </button>
        <button
          className={`px-4 py-2 rounded ${type === "rid" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleChange("rid")}
        >
          按RID排序
        </button>
      </div>
      <ul className="space-y-2">
        {list.map((item) => (
          <li
            key={item.id}
            className="p-3 bg-white shadow rounded items-center flex justify-between"
          >
            <span>
              ID: {item.id} | RID: {item.rid} | Content: {item.content}
            </span>
            <button
              onClick={() => handleDel(item.id)}
              className="px-3 py-1 bg-red-100 text-white rounded hover:bg-red-600 transition-colors"
            >
              Del
            </button>
          </li>
        ))}
      </ul>
      <div>
        <p>
          bigcat:{b}
        </p>
      </div>
      <Son data={initialUsers} aFun={getSonMsg} />
      <Son2 msg={msg} />
      <MyContext.Provider value={msg}>
        <Son3 />
      </MyContext.Provider>
      <Form />
    </div>
  );
}

function Son({ data, aFun }) {
  return (
    <div>
      <ul>
        {data.map((n: User) => (
          <li key={n.id}>{n.content}</li>
        ))}
        <li>1</li>
        <button className="bg-red-900" onClick={() => aFun("asdsadasd")}>
          click
        </button>
      </ul>
    </div>
  );
}

function Son2(props) {
  return <p>this is from Son1{props.msg}</p>;
}

function Son3() {
  const msg = useContext(MyContext);
  return <p>this is from contdasasdext ::::{msg}</p>;
}

function Form() {
  const [firstName, setFirstName] = useState("111");
  const [lastName, setLastName] = useState("222");

  // ✅
  const fullName = firstName + " " + lastName;

  const handleFirstNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setLastName(e.target.value);
  };

  return (
    <div>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={handleFirstNameChange} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" value={lastName} onChange={handleLastNameChange} />
      </label>
      <br />
      <p>Full Name: {fullName}</p>
      <button
        onClick={() => {
          setLastName("asdas");
        }}
      >
        click
      </button>
      <Hook />
    </div>
  );
}

function useToggle() {
  const [value, setValue] = useState(true);

  const toggle = () => {
    setValue(!value);
  };
  return {
    value,
    toggle,
  };
}

function Hook() {
  const navigate = useNavigate();
  const gotodash = () => {
    // const navigate = useNavigate();
    navigate("/dashboard");
  };
  const { value, toggle } = useToggle();
  return (
    <div className="flex-auto h-20 w-20 bg-amber-400">
      {value && <div>this shows while true</div>}
      <button onClick={toggle}>toggle</button>
      <button onClick={gotodash}>gotodashboard</button>
    </div>
  );
}

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

interface BoardProps {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (nextSquares: Array<string | null>) => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className="w-16 h-16 border border-gray-300 bg-white text-3xl font-bold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const handleClick = (id: number) => {
    if (squares[id] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[id] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  };
  let status;
  const winner = calculateWinner(squares);
  if (winner) {
    status = "Winner:" + winner;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }
  return (
    <>
      <div className="text-xl font-bold text-gray-700 mb-4">{status}</div>
      <div className="flex gap-1">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="flex gap-1">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="flex gap-1">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  const moves = history.map((squares, move) => {
    const description = move === 0 ? "返回游戏开始" : `跳转到第 ${move} 步`;
    return (
      <li key={move} className="mb-2">
        <button
          className={`px-4 py-2 rounded ${move === currentMove
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          井字棋游戏
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md min-w-[200px]">
            <h2 className="text-xl font-bold text-gray-700 mb-4">游戏历史</h2>
            <ol className="list-none">{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}
