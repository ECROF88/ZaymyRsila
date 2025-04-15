import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

const PAGE_SIZE = 5; // 每页加载的数据量

function generateMockData(startIndex: number, count: number) {
	return Array.from({ length: count }, (_, index) => {
		const id = startIndex + index + 1;
		return {
			id: `${id}`,
			name: `Item ${id}`,
		};
	});
}

interface TableItem {
	id: string;
	name: string;
}

function ScrollableTable() {
	const [data, setData] = useState<TableItem[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
	const [isAnimating, setIsAnimating] = useState(false);
	const loadingRef = useRef<HTMLDivElement>(null); // Ref for the loading indicator div
	const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

	// 模拟 API 数据获取 (使用提供的 generateMockData)
	const fetchData = useCallback(async (currentPage: number) => {
		setLoading(true);
		setIsAnimating(true); // Start animation when loading starts

		try {
			// 模拟延迟
			await new Promise((resolve) => setTimeout(resolve, 2500));
			const startIndex = (currentPage - 1) * PAGE_SIZE;
			const newData = generateMockData(startIndex, PAGE_SIZE);
			if (newData.length === 0) {
				setHasMore(false); // 没有更多数据了
			} else {
				setData((prevData) => [...prevData, ...newData]);
			}
		} catch (error) {
			console.error("Failed to load data:", error);
			setHasMore(false); // In case of error, prevent further loading
		} finally {
			setLoading(false);
			setIsAnimating(false); // End animation when loading finishes
		}
	}, []);

	useEffect(() => {
		// 初始加载第一页数据
		fetchData(page);
		setPage((prevPage) => prevPage + 1);
	}, [page, fetchData]); // 依赖为空数组，只在组件挂载时执行一次

	const loadMoreData = useCallback(() => {
		if (loading || !hasMore) {
			return; // 避免重复加载或没有更多数据时加载
		}
		fetchData(page);
		setPage((prevPage) => prevPage + 1);
	}, [fetchData, loading, hasMore, page]);

	useEffect(() => {
		// 使用 IntersectionObserver 观察 loadingRef 元素
		const observer = new IntersectionObserver(
			(entries) => {
				// 当 loading 元素进入视口时
				if (entries[0].isIntersecting && !loading && hasMore) {
					loadMoreData();
				}
			},
			{
				root: scrollContainerRef.current, // 将滚动容器作为根元素
				threshold: 1.0, // 完全可见时触发
			},
		);

		if (loadingRef.current) {
			observer.observe(loadingRef.current);
		}

		return () => observer.disconnect();
	}, [loadMoreData, loading, hasMore]);

	return (
		<div className="max-w-screen-md mx-auto mt-8 border border-gray-300 rounded-md overflow-hidden relative">
			<div
				ref={scrollContainerRef}
				className="max-h-[400px] overflow-y-auto" // Added scrollable container with max-height and scroll
			>
				<table className="w-full table-auto border-collapse">
					<thead className="bg-gray-100 sticky top-0">
						{" "}
						{/* sticky top for header */}
						<tr>
							<th className="border border-gray-300 px-4 py-2 text-left font-bold">
								ID
							</th>
							<th className="border border-gray-300 px-4 py-2 text-left font-bold">
								Name
							</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<tr key={item.id}>
								<td className="border border-gray-300 px-4 py-2 ">{item.id}</td>
								<td className="border border-gray-300 px-4 py-2">
									{item.name}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div
					ref={loadingRef}
					id="loading-indicator-container"
					className="text-center py-2 relative overflow-hidden"
				>
					{loading && (
						<div className="">
							<div
								className={`text-gray-600 pt-2 ${isAnimating ? "animate-feedback" : ""}`}
							>
								加载中...
							</div>
						</div>
					)}
					{!hasMore && data.length > 0 && (
						<div className="text-gray-600 pt-2">没有更多数据了</div>
					)}
					{!hasMore && data.length === 0 && (
						<div className="text-gray-600 pt-2">暂无数据</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ScrollableTable;
