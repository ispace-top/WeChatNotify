/**
 * 微信应用通知渠道配置类
 */
export class NotifyChannel {
    public corpId!: String;
    public corpSecret!: String;
    public agentId!: String;
    public url!: String;
    public author!: String;
    public thumbId!: String;
    public toUser!:String;

    constructor(corpid: String, corpsecret: String, agentid: String, author: String, thumbId: String, url: String,toUser:String) {
        this.corpId = corpid;
        this.corpSecret = corpsecret;
        this.agentId = agentid;
        this.author = author;
        this.thumbId = thumbId;
        this.url = url;
        this.toUser=toUser;
    }

    public static build(): NotifyChannel {
        return new NotifyChannel(
            process.env.CORP_ID as String,
            process.env.CORP_SECRET as String,
            process.env.AGENT_ID as String,
            process.env.AUTHOR as String,
            process.env.THUMB_ID as String,
            process.env.URL as String,
            process.env.TO_USER as String
        );
    }

    public static buildTest(): NotifyChannel {
        return new NotifyChannel(
            process.env.CORP_ID as String,
            process.env.CORP_SECRET as String,
            process.env.AGENT_ID as String,
            process.env.AUTHOR as String,
            process.env.THUMB_ID as String,
            process.env.URL as String,
            process.env.TO_USER as String
        );
    }

}