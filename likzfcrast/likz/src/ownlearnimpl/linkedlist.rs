use std::fmt::Display;

#[derive(Debug)]
pub struct Node<T> {
    pub value: T,
    pub next: Option<Box<Node<T>>>,
}

pub struct LinkedList<T> {
    pub head: Option<Box<Node<T>>>,
}

impl LinkedList<i32> {
    pub fn new() -> Self {
        LinkedList { head: None }
    }

    // push 插入到链表头部
    pub fn push(&mut self, data: i32) {
        let new_node = Box::new(Node {
            value: data,
            next: self.head.take(),
        });
        self.head = Some(new_node);
    }

    pub fn push_back(&mut self, data: i32) {
        let new_node = Box::new(Node {
            value: data,
            next: None,
        });

        if self.head.is_none() {
            self.head = Some(new_node);
            return;
        }

        let mut cur = &mut self.head;
        while let Some(ref mut node) = cur {
            if node.next.is_none() {
                node.next = Some(new_node);
                return;
            }
            cur = &mut node.next;
        }
    }

    pub fn delete_by_value(&mut self, data: i32) {
        // let mut cur = &mut self.head;
        // loop {
        //     match cur {
        //         Some(node) if node.value == data => {
        //             *cur = node.next.take();
        //             return;
        //         }
        //         Some(node) => {
        //             cur = &mut node.next;
        //         }
        //         None => break,
        //     }
        // }

        // let mut cur = &mut self.head;
        // while let Some(node) = cur.take() {
        //     if node.value == data {
        //         // 删除当前节点
        //         *cur = node.next;
        //         return;
        //     } else {
        //         // 将当前节点放回去，并继续遍历下一个节点
        //         *cur = Some(node);
        //         cur = &mut cur.as_mut().unwrap().next;
        //     }
        // }

        let mut cur = &mut self.head;
        while let Some(mut node) = cur.take() {
            if node.value == data {
                *cur = node.next.take();
                return;
            } else {
                *cur = Some(node);
                cur = &mut cur.as_mut().unwrap().next; // Converts from &mut Option<T> to Option<&mut T
            }
        }
    }

    pub fn printLinkedList(&self) {
        let mut cur = &self.head;
        while let Some(ref node) = cur {
            print!("{} ", node.value);
            cur = &node.next;
        }
    }
}
