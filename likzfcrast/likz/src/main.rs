mod leetcodes;
mod ownlearnimpl;
use leetcodes::{p128, p49};
use ownlearnimpl::linkedlist::{LinkedList, Node};
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

    let mut list1 = LinkedList::new();

    list1.push_back(1);
    // list1.push_back(2);
    // list1.push_back(31);
    list1.delete_by_value(1);
    list1.printLinkedList();
}
