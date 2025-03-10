import express from 'express';
import { WechatNotify } from './notify.js';
import { NotifyChannel } from './notify_channel.js';
import { NotificationFactory } from './notification_factory.js';
import * as dotenv from 'dotenv';
dotenv.config();

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


// 初始化通知服务
const providers = NotificationFactory.loadFromEnv();

// 消息发送示例
// 定义 NotificationMessage 类型
type NotificationMessage = {
  title: string;
  content: string;
  type: string;
  receiver: string;
};

const sendNotification = async (message: NotificationMessage) => {
  await Promise.all(providers.map((provider: any) => 
    provider.sendMessage({
      ...message,
      type: message.type as "text" | "markdown" | "html"
    })
      .catch((error: any) => console.error(`[${provider.constructor.name}] 发送失败:`, error))
  ));
};

// 使用示例
sendNotification({
  title: '系统通知',
  content: '这是一条测试消息',
  type: 'text',
  receiver: '@all'
});

dotenv.config();