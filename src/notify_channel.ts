/**
 * 微信应用通知渠道配置类
 */
/**
 * 企业微信通知渠道配置实体
 * @property corpId - 企业ID（在企业管理后台查看）
 * @property corpSecret - 应用密钥（在应用管理后台获取）
 * @property agentId - 应用ID（在应用管理后台查看）
 * @property url - 消息跳转链接（textcard和图文消息使用）
 * @property author - 图文消息作者标识
 * @property thumbId - 图文消息缩略图素材ID
 * @property toUser - 默认消息接收人（成员ID列表，多个用|分隔）
 */
export class NotifyChannel {
    /**
     * 企业微信应用配置
     * @param corpId - 企业ID（从企业微信管理后台获取）
     * @param corpSecret - 应用凭证密钥（从应用管理页面获取）
     * @param agentId - 应用唯一标识（从应用详情页获取）
     * @param author - 消息作者标识（用于图文消息）
     * @param thumbId - 缩略图素材ID（通过素材管理接口上传获取）
     * @param url - 消息详情跳转链接
     * @param toUser - 默认消息接收人（格式：UserID1|UserID2，默认@all）
     */
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

    /**
     * 构建正式环境通知渠道配置
     * @throws 当必要环境变量缺失时抛出错误
     */
    public static build(): NotifyChannel {
        this.validateEnvVars();
        return new NotifyChannel(
            process.env.CORP_ID!,
            process.env.CORP_SECRET!,
            process.env.AGENT_ID!,
            process.env.AUTHOR!,
            process.env.THUMB_ID!,
            process.env.URL!,
            process.env.TO_USER!
        );
    }

    /**
     * 验证必需的环境变量
     * @private
     */
    private static validateEnvVars(): void {
        const requiredVars = [
            'CORP_ID', 'CORP_SECRET', 'AGENT_ID', 
            'AUTHOR', 'THUMB_ID', 'URL', 'TO_USER'
        ];

        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`缺失必需环境变量：${missingVars.join(', ')}`);
        }
    }

    /**
     * 构建测试环境通知渠道配置（不强制校验环境变量）
     * @remarks 适用于本地开发和单元测试场景
     */
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