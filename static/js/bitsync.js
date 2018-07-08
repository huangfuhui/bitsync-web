/**
 * 基础js文件
 */

const BASE_RUL = "http://localhost:8090";
const WS_URL = "ws://localhost:8088/market";

var priceArr = [];

/**
 * 程序睡眠一段时间
 * @param numberMillis 毫秒
 * @returns {boolean}
 */
function sleep(numberMillis) {
    let now = new Date();
    let exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return true;
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

/**
 * 行情查询
 */
function market() {
    let initList = false;
    let con = new WebSocket(WS_URL);

    con.onopen = function () {
        console.log("建立连接");

        let currentTime = new Date().getTime();
        con.send(JSON.stringify({"ping": currentTime}));
    };
    con.onclose = function () {
        console.log("关闭连接");
        $.toast("连接走丢了，点击刷新找回吧");
    };
    con.onmessage = function (evt) {
        let res = JSON.parse(evt.data);
        let data = res.response;

        if (res.code != 200) {
            con.close();
            $.toast("服务器开小差了");
            return;
        }

        if (!initList) {
            // 初始化列表
            for (i = 0; i < data.length; i++) {
                let detail = data[i];
                let symbol = detail.symbol.replace("/", "-");

                if (detail.exchange_id == 1) {
                    let html = '<li class="item-content"><div class="item-media"><i class="icon"></i></div><div class="item-inner"><div class="item-title">' + detail.symbol + '</div><div id ="' + "huobi-" + symbol + '" class="item-after">' + detail.price + '</div></div></li>';
                    priceArr["huobi-" + symbol] = detail.price;
                    $("#huobi-usdt-market-list").append(html);
                } else if (detail.exchange_id == 2) {
                    let html = '<li class="item-content"><div class="item-media"><i class="icon"></i></div><div class="item-inner"><div class="item-title">' + detail.symbol + '</div><div id ="' + "dragonex-" + symbol + '" class="item-after">' + detail.price + '</div></div></li>';
                    priceArr["dragonex-" + symbol] = detail.price;
                    $("#dragonex-usdt-market-list").append(html);
                }
            }
            initList = true;

            // 等待300毫秒再请求数据
            window.setInterval(function () {
                let currentTime = new Date().getTime();
                con.send(JSON.stringify({"ping": currentTime}));
            }, 300);
        } else {
            // 更新数据
            for (i = 0; i < data.length; i++) {
                let detail = data[i];
                let symbol = detail.symbol.replace("/", "-");

                if (detail.exchange_id == 1 && detail.price != priceArr["huobi-" + symbol]) {
                    priceArr["huobi-" + symbol] = detail.price;
                    $("#huobi-" + symbol).html(detail.price);
                } else if (detail.exchange_id == 2 && detail.price != priceArr["dragonex-" + symbol]) {
                    priceArr["dragonex-" + symbol] = detail.price;
                    $("#dragonex-" + symbol).html(detail.price);
                }
            }
        }
    };
    con.onerror = function () {
        console.log("发生错误");
        con.close();
    };
}
