mod leetcodes;
use leetcodes::{p128, p49};
fn main() {
    println!(
        "{:?}",
        p49::group_anagrams(vec![
            "eat".to_string(),
            "tea".to_string(),
            "tan".to_string(),
            "ate".to_string(),
            "nat".to_string(),
            "bat".to_string(),
        ])
    );

    println!("{}", p128::longest_consecutive(vec![100, 4, 200, 1, 3, 2]));
}
