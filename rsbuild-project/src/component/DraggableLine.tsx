import React, { useState, useRef, useEffect, useCallback } from "react";

// 定义类型
interface Point {
  x: number;
  y: number;
}

interface ControlPoint extends Point {
  id: number;
}

interface Shape {
  type: "line" | "rect";
  start: Point;
  end: Point;
  controlPoints?: ControlPoint[];
}

interface DragOffset {
  x: number;
  y: number;
}

function DraggableLine() {
  // 固定的起点和终点坐标
  const start: Point = { x: 50, y: 50 };
  const end: Point = { x: 250, y: 50 };
  const [shapes, setShapes] = useState<Shape[]>([]); // 存储多个图形
  const [isDragging, setIsDragging] = useState(false);
  // 控制点状态
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([
    { id: 1, x: 150, y: 100 },
  ]);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 }); // 鼠标点击位置与点坐标的偏移

  const svgRef = useRef<SVGSVGElement>(null); //获取SVG的引用, 为了获取鼠标在SVG中的坐标.

  //获取鼠标在SVG画布中的坐标
  const getSVGPoint = useCallback((e: MouseEvent | React.MouseEvent): Point => {
    const svg = svgRef.current;
    if (!svg) {
      return { x: 0, y: 0 };
    }
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      // 检查 ctm 是否为 null
      return point.matrixTransform(ctm.inverse());
    }
    return point;
  }, []);

  // 鼠标按下：开始拖动
  // 控制点拖动事件
  const handleMouseDown = useCallback(
    (pointId: number, e: React.MouseEvent) => {
      const svgPoint = getSVGPoint(e);
      const point = controlPoints.find((p) => p.id === pointId);
      if (!point) return;

      setOffset({
        x: svgPoint.x - point.x,
        y: svgPoint.y - point.y,
      });
      setIsDragging(true);
      setDraggedPoint(pointId);
    },
    [getSVGPoint, controlPoints],
  );

  // 鼠标移动：更新控制点坐标
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || draggedPoint === null) return;
      const svgPoint = getSVGPoint(e);

      setControlPoints((prev) =>
        prev.map((point) =>
          point.id === draggedPoint
            ? {
                ...point,
                x: svgPoint.x - offset.x,
                y: svgPoint.y - offset.y,
              }
            : point,
        ),
      );
    },
    [isDragging, draggedPoint, offset, getSVGPoint],
  );

  // 鼠标释放：停止拖动
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return; // 如果没有拖动，则直接返回
    setIsDragging(false);
    setDraggedPoint(null);
    setShapes((prevShapes) => [
      ...prevShapes,
      {
        type: "line" as const,
        start,
        end,
        controlPoints: controlPoints,
      },
    ]);
  }, [isDragging, start, end, controlPoints]);

  // 监听鼠标移动和释放事件 (在整个文档上监听，以防鼠标移出 SVG 区域)
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  //渲染函数.
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <svg
        ref={svgRef}
        width="400"
        height="300"
        style={{ backgroundColor: "#0d1117", border: "1px solid #ddd" }}
      >
        {/* 使用二次贝塞尔曲线绘制可变形的线条 */}
        <path
          d={`M ${start.x} ${start.y} Q ${controlPoints[0].x} ${controlPoints[0].y} ${end.x} ${end.y}`}
          stroke="#e0e0e0"
          strokeWidth="2"
          fill="none"
        />

        {shapes.map((shape, index) => {
          if (shape.type === "line") {
            const ctrl = shape.controlPoints?.[0] || {
              x: (shape.start.x + shape.end.x) / 2,
              y: shape.start.y - 50,
            };
            return (
              <path
                key={index}
                d={`M ${shape.start.x} ${shape.start.y} Q ${ctrl.x} ${ctrl.y} ${shape.end.x} ${shape.end.y}`}
                stroke="#e0e0e0"
                strokeWidth="2"
                fill="none"
              />
            );
          }
          return null; // 对于未知类型的图形，返回 null
        })}

        {/* 固定的起点 */}
        <circle cx={start.x} cy={start.y} r="6" fill="#3498db" />

        {/* 固定的终点 */}
        <circle cx={end.x} cy={end.y} r="6" fill="#e74c3c" />

        {/* 可拖动的控制点 */}
        {controlPoints.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#2ecc71"
            style={{ cursor: "move" }}
            onMouseDown={(e) => handleMouseDown(point.id, e)}
          />
        ))}
      </svg>
    </div>
  );
}

export default DraggableLine;
