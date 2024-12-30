use std::collections::HashMap;
/*
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
字母异位词 是由重新排列源单词的所有字母得到的一个新单词。
示例 1:
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

*/

pub fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> {
    let mut map = HashMap::new();
    for s in strs {
        let mut sorted = s.clone().into_bytes();
        sorted.sort_unstable();
        map.entry(sorted).or_insert(vec![]).push(s);
    }
    // map.into_iter().map(|(_, v)| v).collect()
    map.into_values().collect()
}
