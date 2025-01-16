function get_next(s) {
  // 处理空字符串的情况
  if (s.length === 0) {
    return [];
  }

  let next = new Array(s.length).fill(0); // next 数组长度改为 s.length
  let i = 1,
    j = 0; // i: 后缀末尾，j: 前缀末尾，也代表最长相等前后缀长度

  // next[0] 默认为 0，从 i=1 开始计算
  while (i < s.length) {
    if (s[i] === s[j]) {
      // 找到相同的前后缀
      i++;
      j++;
      next[i - 1] = j; // 因为 i 要比 next 数组的索引大 1
    } else if (j === 0) {
      // j 已经退回到起始位置，i++
      i++;
    } else {
      // j 回退到 next[j]
      j = next[j - 1]; // 注意这里也需要 -1，因为 next 数组的索引比 i 小 1
    }
  }
  return next;
}
function kmp(s, p) {
  let next = get_next(p);
  console.log("next:", next);
  let i = 0,
    j = 0;
  while (i < s.length && j < p.length) {
    if (s[i] === p[j]) {
      i++;
      j++;
    } else if (j === 0) {
      i++;
    } else {
      j = next[j - 1];
    }
  }
  return j === p.length ? i - j : -1;
}

const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
console.log(kmp(text, pattern)); // 10s
