use std::collections::HashSet;

pub fn longest_consecutive(nums: Vec<i32>) -> i32 {
    let mut ans = 0;
    let st = nums.iter().collect::<HashSet<_>>();
    for &num in &st {
        if st.contains(&(num - 1)) {
            continue;
        }
        let mut cur = *num + 1;
        while st.contains(&cur) {
            cur += 1;
        }
        ans = ans.max(cur - num);
    }
    ans
}

pub fn move_zeroes(nums: &mut Vec<i32>) {
    // let mut count = 0;
    // for i in 0..nums.len() {
    //     if nums[i] != 0 {
    //         nums[count] = nums[i];
    //         count += 1;
    //     } else {
    //         continue;
    //     }
    // }
    // while count < nums.len() {
    //     nums[count] = 0;
    //     count += 1;
    // }

    let (mut left, mut right, n) = (0, 0, nums.len());
    while right < n {
        if nums[right] != 0 {
            nums.swap(left, right);
            left += 1;
        }
        right += 1;
    }
}

