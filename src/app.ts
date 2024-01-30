import express from 'express';
import { WechatNotify } from './notify';
import { NotifyChannel } from './notify_channel';


const app = express();
const PORT = 80;

const wechat_notify = new WechatNotify(NotifyChannel.build());


app.get('/notify/nas', (req, res) => {
    var title = req.query.title as String;
    var info = req.query.info as String;
    var type = req.query.type as String;
    try {
        wechat_notify.sendInfo(title, info, type);
        res.send({
            code: 200,
            data: {
                success: true,
                msg: 'Msg send!'
            }
        });
    } catch (err) {
        res.send({
            code: 200,
            data: {
                success: false,
                msg: 'Msg send Error!!!!!'
            }
        });
    }
});


app.listen(PORT, () => {
    console.log("服务已启动！ 访问地址：http://127.0.0.1:" + PORT);
});