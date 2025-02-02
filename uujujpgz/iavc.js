function binaru_search(arr, key) {
    let array = [...arr].sort((a, b) => a - b);
    console.log(array)
    let left = 0;
    let right = array.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] == key) {
            return mid;
        }
        else if (array[mid] >= key) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return -1;
}


// 二叉搜索寻找插入点，若存在重复元素，则插在最左面,返回插入点
function binaty_search_insertion(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    let mid;
    while (left <= right) {
        mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] < target) {
            left = mid + 1;
            console.log("left=mid+1")
        } else if (nums[mid] >= target) {
            right = mid - 1;
        }
    }
    return left;

}

const arr = [1, 3, 6, 6, 6, 6, 6, 10, 12, 13];
const result = binaty_search_insertion(arr, 6);
console.log("result= ", result)


