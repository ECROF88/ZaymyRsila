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