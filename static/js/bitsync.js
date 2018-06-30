/**
 * 基础js文件
 */

var BASE_RUL = "http://localhost:8090"

/**
 * 程序睡眠一段时间
 * @param numberMillis 毫秒
 * @returns {boolean}
 */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)    return true;
    }
}

/**
 * 等待一段时间后跳转
 * @param url
 * @param timeout
 */
function go(url, timeout) {
    if (!timeout) {
        timeout = 2000
    }

    setTimeout("location.href='" + url + "'", timeout);
}

