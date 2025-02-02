use std::collections::HashMap;

pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for x in 0..nums.len() {
        if let Some(k) = map.get(&(target - nums[x])) {
            return vec![*k as i32, x as i32];
        }
        map.insert(nums[x], x);
    }
    vec![]
}

// 3. Longest Substring Without Repeating Characters
// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长
// 子串的长度。
pub fn length_of_longest_substring(s: String) -> i32 {
    let mut ans = 0;
    let len = s.len();
    let chars = s.chars().collect::<Vec<char>>();
    let mut left = 0;

    for right in 0..len {
        for j in left..right {
            if chars[j] == chars[right] {
                left = j + 1;
                break;
            }
        }
        ans = ans.max(right - left + 1);
    }
    ans as i32
}

// 438. 找到字符串中所有字母异位词

// 这种解法的问题是要求p里面字母不重复，有局限性。
pub fn my_find_anagrams(s: String, p: String) -> Vec<i32> {
    let slen = s.len();
    let plen = p.len();
    let mut map: HashMap<char, i32> = HashMap::new();
    let schars = s.chars().collect::<Vec<char>>();
    let pchars = p.chars().collect::<Vec<char>>();
    for i in 0..plen {
        map.insert(pchars[i], 0);
    }
    let mut left = 0;
    let mut right = 0;
    let mut count = 0;
    let mut ans = vec![];
    while right < slen {
        if let Some(&v) = map.get(&schars[right]) {
            if v == 0 {
                count += 1;
            }
            map.insert(schars[right], 1);
        }
        if right - left + 1 == plen {
            if count == plen {
                ans.push(left as i32);
                map.insert(schars[left], 0);
            }
            left += 1;
        }
        right += 1;
    }
    ans
}
