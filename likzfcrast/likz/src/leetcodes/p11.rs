/*
11. 盛最多水的容器
给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
返回容器可以储存的最大水量。
*/
// 双指针法求解，其中每次移动的是哪个较小的指针，因为容器的容积取决于较小的那个边

pub fn max_area(height: Vec<i32>) -> i32 {
    let mut area: i32 = 0; // 初始化最大面积
    let (mut i, mut j) = (0, height.len() - 1); // 双指针

    while i < j {
        let min_height = std::cmp::min(height[i], height[j]);
        let new_area = (j - i) as i32 * min_height;
        area = area.max(new_area);

        if height[i] < height[j] {
            i += 1;
        } else {
            j -= 1;
        }
    }
    area
}

pub fn three_sum(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
    let mut ans = vec![];
    nums.sort_unstable();
    let n = nums.len();
    for i in 0..n {
        if i > 0 && nums[i] == nums[i - 1] {
            continue;
        }
        let mut l = i + 1;
        let mut r = n - 1;
        let target = -nums[i];
        while l < r {
            if nums[l] + nums[r] == target {
                ans.push(vec![nums[i], nums[l], nums[r]]);
                l += 1;
                r -= 1;
                while l < r && nums[l] == nums[l + 1] {
                    l += 1;
                }
                while l < r && nums[r] == nums[r - 1] {
                    r -= 1;
                }
            } else if nums[l] + nums[r] < target {
                l += 1;
            } else {
                r -= 1;
            }
        }
    }
    ans
}

// 一行一行求
pub fn trap(height: Vec<i32>) -> i32 {
    let n = height.len();
    let mut ans: i32 = 0;
    let mut max_height = 0;
    for &i in &height {
        max_height = max_height.max(i);
    }

    for i in 1..=max_height {
        let mut is_start = false;
        let mut temp = 0;
        for k in 0..n {
            if is_start && height[k] < i {
                temp += 1;
            }
            if height[k] >= i {
                ans += temp;
                temp = 0;
                is_start = true;
            }
        }
    }
    ans
}

// 正确做法，涉及动态规划
pub fn trap_2(height: Vec<i32>) -> i32 {
    let len = height.len();
    let mut ans: i32 = 0;

    let mut anyone_right_highest = vec![0; len];
    let mut anyone_left_highest = vec![0; len];

    for i in 1..len {
        anyone_left_highest[i] = anyone_left_highest[i - 1].max(height[i - 1]);
    }

    for i in (0..len - 1).rev() {
        anyone_right_highest[i] = anyone_right_highest[i + 1].max(height[i + 1]);
    }

    for i in 1..len {
        let min = anyone_left_highest[i].min(anyone_right_highest[i]);
        if min > height[i] {
            ans += min - height[i];
        }
    }
    ans
}

// 双指针

pub fn trap_3(height: Vec<i32>) -> i32 {
    let len = height.len();
    let mut ans: i32 = 0;
    let mut left = 0;
    let mut right = len - 1;
    let mut left_max = 0;
    let mut right_max = 0;

    while left < right {
        if height[left] < height[right] {
            if height[left] >= left_max {
                left_max = height[left];
            } else {
                ans += left_max - height[left];
            }
            left += 1;
        } else {
            if height[right] >= right_max {
                right_max = height[right];
            } else {
                ans += right_max - height[right];
            }
            right -= 1;
        }
    }
    ans
}
