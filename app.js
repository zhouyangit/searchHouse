/**
 * [皖水公寓可入住房源查询]
 * 
 * @module [axios, nodemailer]
 * 
 * author: marven@163.com
 * 
 * date: 2017/08/16
 * 
 */

const nodemailer = require('nodemailer');
const axios = require('axios')
let i = 1;
setInterval(()=> {
    console.log(`可入住房源第${i}次查询中...`)
    axios.get('http://117.71.57.99:9080/online/roomResource.xp?action=formList1&code=01&buildingCode=0011449816806945psc')
        .then(res=> {
            formatData(res.data.list, '1栋')
        });

    axios.get('http://117.71.57.99:9080/online/roomResource.xp?action=formList1&code=01&buildingCode=0011449816830250MuI')
        .then(res=> {
            formatData(res.data.list, '2栋')
        });

    axios.get('http://117.71.57.99:9080/online/roomResource.xp?action=formList1&code=01&buildingCode=0011449816876736sfx')
        .then(res=> {
            formatData(res.data.list, '综合楼东')
        });

    axios.get('http://117.71.57.99:9080/online/roomResource.xp?action=formList1&code=01&buildingCode=0011449816949458BXk')
        .then(res=> {
            formatData(res.data.list, '综合楼西')
        })
    i++
},30000)

function formatData(list, info) {

    for (var key in list) {
        for (var j = 0; j < list[key].length; j++) {

            const roomInfo = list[key][j]

            let {id,status,roomFloor,roomName,roomType} = roomInfo
          
            if (status == 02) {
                axios.get(`http://117.71.57.99:9080/online/roomConfig.xp?action=getRoomConfig&roomID=${id}`).then(res => {
                   let {itemName,roomTypeName,price,roomArea}  = res.data.info;
                   let roomDirection = res.data.roomDirection;
                   sendEmail(info, roomFloor, roomName,roomDirection,roomTypeName,price,roomArea)
                })
            }
        }
    }
}

function sendEmail(info, roomFloor, roomName,roomDirection,roomTypeName,price,roomArea,itemName) {

    
    // 开启一个 SMTP 连接池
    let transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        secureConnection: true, // use SSL
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'marven@163.com',
            pass: 'qq123456' // QQ邮箱需要使用授权码
        }
    });

    // 设置邮件内容（谁发送什么给谁）
    let mailOptions = {
        from: '"zhouyang" <marven@163.com>', // 发件人
        to: 'yangzhou2@iflytek.com', // 收件人
        subject: `Hello ✔有可入住的房源啦`, // 主题
        text: 'search house', // plain text body
        html: `<b style="font-size:18px;">已为你搜到可入住的房源啦</b>
                <br>
                <p style="font-size:22px">房间信息：${info}--${roomFloor}楼--${roomName}</p>
                <p style="font-size:22px;color'#db384c'">房间类型：${roomTypeName}</p>
                <p style="font-size:22px">房间价格：${price}元/月</p>
                <p style="font-size:22px">房间大小：${roomArea}m²米</p>
                <p style="font-size:22px">房间朝向：${roomDirection}</p>
                <p style="font-size:22px">房间配置：${itemName}</p>
                <a style="font-size:18px;color:blue" href="http://117.71.57.99:9080/online">立即登录</a>`,
    };

    // 使用先前创建的传输器的 sendMail 方法传递消息对象
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message: ${info.messageId}`);
        console.log(`sent: ${info.response}`);
    });

}