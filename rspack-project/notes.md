inline 内联 不独占一行
block 块级，独占一行


弹性容器flex，默认方向是水平的，
块级元素在容器中也不再独占一行
可以调为column 变为纵向

flex：1 
flex-grow 占据剩余空间的比例/* 默认值为 0，不扩展 */
flex-shrink/* 默认值为 1，允许收缩 */
flex-basis  定义项目在主轴上的初始大小
flex 是 flex-grow、flex-shrink 和 flex-basis 的简写形式
```css
.item {
  flex: 1; /* 等价于 flex: 1 1 0 */
  flex: 1 0 auto; /* 不收缩，扩展比例为 1，初始大小为 auto */
}
```
响应式设计 通过flex-grow和flex-shrink实现自适应布局。


justify-content:
space-around 均匀分部空白空间
space-between 压缩两测
flex-start
flex-end
center

align-items: 
flex-start
flex-end
center

grid布局
.grid{
    display:grid
    //grid-tempalte-rows:100px 200px 300px
    //grid-template-columns:1fr 2fr
    grid-tempalte-columns:repeat(4,1fr)
    grid-auto-rows:100px //自适应每行100xp
    grid-auto-columns :1fr // 自适应每行等宽
    grid-gap
}

定位
相对定位 relative
绝对定位 absolute 需要一个相对于非static的父元素
固定定位 fixed  相对于浏览器的窗口
默认为静态定位 position：static
.absolute { // 相对于父元素的位置
    position:absolute
    top:50%
    left:50%
}

盒子模型：
top right bottom left
margin-right:10px
padding-top:8px
上下等宽，左右等宽：
margin: 6px(上下) 12px（左右）
margin: 12px 8px 10px 14px (上右下左，顺时针)
border: 2px solid black （有好几种线条）

useEffect:
1. 没有依赖项 ：初始+ 组件更新,组件更新的时候useeffect里面也会重新执行
2. 依赖项空数组[] : 只有初始
3. 传入特定依赖项 初始+依赖项变化时
清除副作用： cleanup清理函数
return () => {
  /// 清除副作用逻辑
}
1. 将组件挂载到页面时，将运行 setup 代码。
2. 重新渲染 依赖项 变更的组件后：
 - 首先，使用旧的 props 和 state 运行 cleanup 代码。
 - 然后，使用新的 props 和 state 运行 setup 代码。
3. 当组件从页面卸载后，cleanup 代码 将运行最后一次。

useContext 和自定义 Hook可以在外部使用

自定义Hook本质是进行功能的封装抽象

执行按钮自身的事件处理函数，不触发父元素的点击事件。
e.stopPropagation();

useMemo(()=>{..},[]) 缓存，防止不必要的计算
useState:修改值的时候触发重新渲染，组件重新渲染的时候获取之前的值

const count = useRef(0) 有记忆功能，组件重新渲染的时候获取之前的值
获取值: count.current
修改: count.currnet +=1 改变值不会触发重新渲染  
`<h1 ref={(dom)=>{dom.style.....}}></h1>` 渲染后就去执行ref里面的函数
`<h1 ref={xx}></h1>` 将一个xx=useRef() 绑定到h1上
console.log(xx)的时候打印的就是这个html
forwardRef：将ref转发到子组件中的 DOM 元素或子组件实例:
const Myco = forwardRef( (props, ref)=>{
  return <input type="text" ref={ref} {...props} />;
})
useImperativeHandle:
通常与 forwardRef 一起使用,允许子组件控制父组件通过 ref 访问的内容。
```js
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  // 自定义暴露给父组件的内容
  // 注意inputRef和父组件传递的ref不是一个东西
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

    // "build": "cross-env NODE_ENV=production rspack build",
    // "dev": "cross-env NODE_ENV=development rspack serve",