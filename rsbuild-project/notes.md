# 笔记

## CSS

### 显示类型
- `inline`: 内联元素，不独占一行
- `block`: 块级元素，独占一行

### Flex布局
Flex容器的基本特性：
- 默认方向是水平的
- 块级元素在容器中不再独占一行
- 可以通过`flex-direction: column`设置为纵向

```css
flex: 1;  /* 是以下三个属性的简写 */
```
- `flex-grow`：占据剩余空间的比例（默认值为0，不扩展）
- `flex-shrink`：收缩比例（默认值为1，允许收缩）
- `flex-basis`：定义项目在主轴上的初始大小

完整示例：
```css
.item {
  flex: 1;           /* 等价于 flex: 1 1 0 */
  flex: 1 0 auto;    /* 不收缩，扩展比例为1，初始大小为auto */
}
```

#### 对齐方式
`justify-content`属性：
- `space-around`：均匀分布空白空间
- `space-between`：两端对齐
- `flex-start`：起点对齐
- `flex-end`：终点对齐
- `center`：居中对齐

`align-items`属性：
- `flex-start`：顶部对齐
- `flex-end`：底部对齐
- `center`：垂直居中

### Grid布局
```css
.grid {
    display: grid;
    /* grid-template-rows: 100px 200px 300px; */
    /* grid-template-columns: 1fr 2fr; */
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 100px;     /* 自适应每行100px */
    grid-auto-columns: 1fr;    /* 自适应每列等宽 */
    grid-gap: 10px;           /* 网格间距 */
}
```

### 定位
位置类型：
- `relative`：相对定位
- `absolute`：绝对定位（需要一个非static的父元素）
- `fixed`：固定定位（相对于浏览器窗口）
- `static`：默认静态定位

绝对定位示例：
```css
.absolute {    /* 相对于父元素的位置 */
    position: absolute;
    top: 50%;
    left: 50%;
}
```

### 盒子模型
边距设置：
- 单边设置：`margin-right: 10px`，`padding-top: 8px`
- 上下左右同时设置：
  - `margin: 6px 12px;`（上下6px，左右12px）
  - `margin: 12px 8px 10px 14px;`（上右下左，顺时针）
- 边框：`border: 2px solid black;`（宽度 样式 颜色）

## React Hooks

### useEffect
使用场景：
1. 无依赖项：初始化和每次组件更新时执行
2. 空依赖数组`[]`：仅在初始化时执行
3. 有依赖项：初始化和依赖项变化时执行

清除副作用：
```javascript
useEffect(() => {
  // 设置逻辑
  return () => {
    // 清除副作用逻辑
  };
}, [dependencies]);
```

执行顺序：
1. 组件挂载：执行setup代码
2. 依赖项变更：
   - 先执行cleanup（使用旧props和state）
   - 再执行setup（使用新props和state）
3. 组件卸载：最后执行cleanup

### 其他Hooks

#### useState
- 修改值时触发重新渲染
- 组件重新渲染时获取之前的值

#### useRef
```javascript
const count = useRef(0);  // 有记忆功能，组件重新渲染时保持值
// 获取值：count.current
// 修改值：count.current += 1（不会触发重新渲染）
```

ref的使用方式：
```jsx
<h1 ref={(dom) => {dom.style.color = 'red'}}></h1>  // 直接操作DOM
<h1 ref={myRef}></h1>  // myRef = useRef()，绑定到h1元素
```

#### forwardRef & useImperativeHandle
转发ref到子组件：
```jsx
const MyComponent = forwardRef((props, ref) => {
  return <input type="text" ref={ref} {...props} />;
});
```

使用useImperativeHandle控制暴露给父组件的实例值：
```jsx
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
  }));
  
  return <input ref={inputRef} type="text" />;
});
```

#### 其他Hook说明
- `useContext`：可在外部使用的上下文
- `useMemo(() => {...}, [])`：缓存计算结果，防止不必要的重复计算
- 自定义Hook：本质是功能的封装抽象

### 事件处理
阻止事件冒泡：
```javascript
e.stopPropagation();  // 阻止事件向父元素传播
```