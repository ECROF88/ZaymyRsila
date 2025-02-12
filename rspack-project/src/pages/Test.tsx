import React, { createContext, useContext, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
interface User {
  id: number;
  rid: number;
  content: string;
}
const MyContext = createContext('');
const initialUsers: User[] = [
  { id: 1, rid: 3, content: 'a' },
  { id: 2, rid: 2, content: 'b' },
  { id: 3, rid: 1, content: dayjs(new Date()).format('MM-DD hh:mm:ss') },
];
export default function Test() {
  const navigate = useNavigate();
  const [list, setList] = useState<User[]>(initialUsers);
  const [type, setType] = useState<'id' | 'rid'>('id');
  const handleChange = (type: 'id' | 'rid') => {
    // console.dir(ref1.current);
    console.log(type);
    setType(type);
    const sortedlist = sortlist([...list], type);
    setList(sortedlist);
  };
  const sortlist = (data: User[], sortby: string) => {
    return data.sort((a, b) => {
      let compareValue = 0;
      if (sortby === 'id') {
        compareValue = a.id - b.id;
      } else if (sortby === 'rid') {
        compareValue = a.rid - b.rid;
      }
      return compareValue;
    });
  };

  const [addcon, setAddcon] = useState('');
  const additem = () => {
    const newUser: User = {
      id: list.length + 1,
      rid: Math.floor(Math.random() * 100),
      content: addcon,
    };
    setList(sortlist([...list, newUser], type));
    setAddcon('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleDel = (id: number) => {
    setList(list.filter((item) => item.id !== id));
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const getSonMsg = (msg: string) => {
    setMsg(msg);
  };

  return (
    <div className="p-4">
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
          className={`px-4 py-2 rounded ${type === 'id' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleChange('id')}
        >
          按ID排序
        </button>
        <button
          className={`px-4 py-2 rounded ${type === 'rid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleChange('rid')}
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

      <Son data={initialUsers} aFun={getSonMsg} />
      <Son2 msg={msg} />
      <MyContext.Provider value={msg}>
        <Son3 />
      </MyContext.Provider>
      <Form />
      <div className="bg-blue-500 p-4 group">
        <button className="text-white">Click me</button>
        <button className="text-red-200 group-hover:hidden">Click me</button>
      </div>
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
        <button className="bg-red-900" onClick={() => aFun('asdsadasd')}>
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
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // ✅ 非常好：在渲染期间进行计算
  const fullName = firstName + ' ' + lastName;

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
          setLastName('asdas');
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
    navigate('/dashboard');
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
