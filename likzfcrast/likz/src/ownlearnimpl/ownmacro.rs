use std::fmt::{self, Write};

// 自定义输出结构体
struct MyStdout;

// 实现 Write trait
impl Write for MyStdout {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        for c in s.chars() {
            unsafe {
                // putchar(c as i32);
            }
        }
        Ok(())
    }
}

use std::fs;
use std::io;

pub fn get_file_name(path: String) {
    let paths = fs::read_dir(path).unwrap();
    for path in paths {
        println!("{:?}", path.unwrap().path());
    }
}

fn main() -> io::Result<()> {
    // 获取当前目录
    // let current_dir = std::env::current_dir()?;

    // // 读取当前目录下的所有条目
    // let entries = fs::read_dir(current_dir)?;

    // // 遍历目录条目并打印文件名
    // for entry in entries {
    //     let entry = entry?;
    //     let file_name = entry.file_name();
    //     println!("{}", file_name.to_string_lossy());
    // }
    get_file_name("./".to_string());
    Ok(())
}
