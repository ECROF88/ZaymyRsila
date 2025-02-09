import React, { useState, useEffect, useRef } from "react";

const generateMockData = (startIndex: number, count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const id = startIndex + index + 1;
    return {
      id: `${id}`,
      name: `Item ${id}`,
      description: `Description for Item ${id}`,
      date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      status: ["Pending", "Processing", "Completed"][
        Math.floor(Math.random() * 3)
      ],
    };
  });
};

const initialData = generateMockData(0, 20); // 初始加载 20 条数据
const itemsPerPage = 20; // 每次滚动加载 20 条数据

const ScrollableTable = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null); // 用于获取表格容器 DOM 元素的 Ref
  const [nextStartIndex, setNextStartIndex] = useState(initialData.length);
  const loadMoreTrigger = useRef<HTMLElement>(null);
  const loadMoreData = () => {
    if (loading) return; // 防止重复加载
    setLoading(true);
    setTimeout(() => {
      // 模拟异步加载数据
      const newData = generateMockData(nextStartIndex, itemsPerPage);
      setData((prevData) => [...prevData, ...newData]); // 追加新数据
      setNextStartIndex((prevStartIndex) => prevStartIndex + itemsPerPage);
      setLoading(false);
    }, 1000); // 模拟 1 秒加载延迟
  };

  const handleScroll = () => {
    const container = tableContainerRef.current;
    if (!container || loading) return;

    // 滚动到底部的判断条件：
    // 容器滚动高度 + 容器可视高度 >= 容器总高度 - 距离底部阈值
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const scrollThreshold = 50; // 距离底部 50px 时触发加载

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      loadMoreData();
    }
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll); // 组件卸载时移除监听
      };
    }
  }, [loading]); // 监听 loading 状态变化，防止重复绑定事件

  return (
    <div
      className="table-container scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
      ref={tableContainerRef}
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
          <tr ref={loadMoreTrigger}>
            <td colSpan={5} style={{ textAlign: "center" }}>
              加载更多...
            </td>
          </tr>
          {/* {loading && (
            <tr>
              <td className="text-center p-4 text-blue-500 text-lg" colSpan={5}>
                Loading...
              </td>
            </tr>
          )} */}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTable;
