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
    public channel!: NotifyChannel;

    constructor(notifyCchannelhannel: NotifyChannel) {
        this.channel = notifyCchannelhannel;
    }

    public sendText(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.TEXT, toUser);
    }

    public sendTextCard(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.TEXTCARD, toUser);
    }

    public sendHtml(title: String, content: String, toUser?: String) {
        this.send(this.channel, title, content, NotifyType.HTML, toUser);
    }

    public sendInfo(title: String, content: String, type: String, toUser?: String) {
        let enumType=NotifyType.HTML;
        switch (type) {
            case NotifyType.TEXT:
                enumType = NotifyType.TEXT
                return;
            case NotifyType.TEXTCARD:
                enumType = NotifyType.TEXTCARD
                return;
        }
        this.send(this.channel, title, content,enumType, toUser);
    }


    public async send(channel: NotifyChannel, title: String, content: String, type: NotifyType, toUser?: String) {
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

