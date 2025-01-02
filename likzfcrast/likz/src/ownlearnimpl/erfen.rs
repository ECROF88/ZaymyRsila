use std::io;

fn main() {
    // 读取输入
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let nums: Vec<i64> = line
        .split_whitespace()
        .map(|s| s.parse().unwrap())
        .collect();
    let n = nums[0] as usize;
    let m = nums[1];

    line.clear();
    io::stdin().read_line(&mut line).unwrap();

    // let mut a = vec![0 as i64; n];
    // for i in 0..n {
    //     let mut input = String::new();
    //     io::stdin().read_line(&mut input).unwrap();
    //     a[i] = input.trim().parse().expect("Invalid input");
    // }
    let mut a = line
        .split_whitespace()
        .map(|s| s.parse().expect("vaild input"))
        .collect::<Vec<i64>>();
    // 排序数组
    a.sort_unstable();

    let mut count = 0;

    // 遍历数组 a
    for i in 0..n {
        // 使用二分查找找到第一个满足 a[i] + a[j] > m 的 j
        let mut left = i + 1;
        let mut right = n - 1;
        let mut pos = 0;
        while left <= right {
            let mid = (left + right) / 2;
            if a[i] + a[mid] > m {
                pos = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
            if pos != 0 {
                count += n - pos;
            }
        }
    }

    // 输出结果
    println!("{}", count);
}
