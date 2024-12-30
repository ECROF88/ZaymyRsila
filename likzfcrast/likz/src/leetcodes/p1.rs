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
