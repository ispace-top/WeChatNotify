import { NotifyType } from "./notity_type";
import axios from 'axios'
import { NotifyChannel } from './notify_channel';

const BASE_URL = "https://qyapi.weixin.qq.com/cgi-bin/";
const ACCESS_TOKEN_URL = 'gettoken';
const SEND_MESSAGE_URL = "message/send?access_token=";

const netInstance = axios.create({
    baseURL: BASE_URL, timeout: 5000, headers: {
        'Content-Type': 'application/json',
    }
});


export class WechatNotify {
    /**
     * 企业微信通知核心类
     * @param notifyChannel - 通知渠道配置，包含企业ID、应用密钥等信息
     */
    public channel!: NotifyChannel;

    constructor(notifyChannel: NotifyChannel) {
        this.channel = notifyChannel;
    }

    /**
     * 发送文本类型通知
     * @param title - 消息标题（企业微信消息实际无标题字段，保留参数供后续扩展）
     * @param content - 消息正文内容
     * @param toUser - 指定接收成员ID，默认@all
     */
    public sendText(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.TEXT, toUser);
    }

    public sendTextCard(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.TEXTCARD, toUser);
    }

    public sendHtml(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.HTML, toUser);
    }

    /**
     * 根据类型参数发送消息（兼容旧版API）
     * @param type - 消息类型字符串，支持'text'/'textCard'/'html'
     */
    public sendInfo(title: String, content: String, type: String, toUser?: String) {
        let enumType: NotifyType;
        switch (type.toLowerCase()) {
            case 'text':
                enumType = NotifyType.TEXT;
                break;
            case 'textcard':
                enumType = NotifyType.TEXTCARD;
                break;
            case 'html':
                enumType = NotifyType.HTML;
                break;
            default:
                throw new Error(`无效的类型参数: ${type}`);
        }
        this.send(this.channel, title, content, enumType, toUser);
    }


    public async send(channel: NotifyChannel, title: String, content: String, type: NotifyType, toUser?: String) {
        // 参数校验
        if (![NotifyType.TEXT, NotifyType.TEXTCARD, NotifyType.HTML].includes(type)) {
            throw new Error(`无效的消息类型: ${type}`);
        }

        // 设置默认接收人
        const receiver = toUser?.trim() || '@all';
        if (toUser == undefined || toUser == null || toUser == "") {
            toUser = channel.toUser;
        }
        var data = this.getOptionByType(title, content, type, channel, toUser);
        let token = await this.getAccessToken();
        await this.sendNotify(token, channel.agentId, data, toUser);
    }

    private sendNotify(token: String, agentId: String, data: any, toUser?: String): Promise<any> {
        let url = SEND_MESSAGE_URL + token;
        return new Promise((resolve, reject) => {
            netInstance.post(url, {
                touser: toUser,
                agentid: agentId,
                ...data
            }).then(res => {
                console.log("发送消息 =》 " + JSON.stringify(res.data));
                resolve(true);
            }, reason => {
                reject(reason);
                console.log("发送消息失败！ =》 " + reason);
            });
        });
    }


    private getAccessToken(): Promise<any> {
        return new Promise(relsove => {
            netInstance.get(
                ACCESS_TOKEN_URL + "?corpid=" + this.channel.corpId + "&corpsecret=" + this.channel.corpSecret
            ).then(res => {
                if (res.status == 200 && res.data.errcode == 0) {
                    relsove(res.data.access_token);
                } else {
                    relsove(null);
                }
            });
        })
    }
    /**
     * 根据通知类型构建请求参数
     * @param title 通知标题 
     * @param content 通知内容
     * @param type 通知类型，参见枚举 @see NotifyType
     * @returns 
     */
    private getOptionByType(title: String, content: String, type: NotifyType, channel: NotifyChannel, toUser?: String) {
        switch (type) {
            case NotifyType.TEXT:
                return {
                    msgtype: 'text',
                    touser: toUser,
                    text: {
                        content: title + "\n\n" + content
                    }
                }
            case NotifyType.TEXTCARD:
                return {
                    msgtype: 'textcard',
                    touser: toUser,
                    textcard: {
                        title: title,
                        description: content,
                        url: channel.url,
                        btntxt: '更多'
                    }
                }
            case NotifyType.HTML:
                return {
                    msgtype: 'mpnews',
                    touser: toUser,
                    mpnews: {
                        articles: [
                            {
                                title: title,
                                thumb_media_id: channel.thumbId,
                                author: channel.author,
                                content_source_url: channel.url,
                                content: content.replace(/\n/g, '<br/>'),
                                digest: content
                            }
                        ]
                    }
                }
            default:
        }
    }

}

