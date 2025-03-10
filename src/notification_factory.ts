import { NotificationConfig, NotificationProvider } from './notification_provider.js';
import { WechatNotificationProvider } from './notify.js';
// 假设该文件存在于相同目录下，可检查文件是否存在或

export class NotificationFactory {
  private static readonly registry = new Map<string, new (config: any) => NotificationProvider>();

  static {
    this.register('wechat', WechatNotificationProvider);
  }

  static register(channelType: string, providerClass: new (config: any) => NotificationProvider) {
    this.registry.set(channelType, providerClass);
  }

  static create(config: NotificationConfig): NotificationProvider {
    const ProviderClass = this.registry.get(config.channelType);
    if (!ProviderClass) {
      throw new Error(`未注册的通知渠道类型: ${config.channelType}`);
    }
    return new ProviderClass(config.channelConfig);
  }

  static loadFromEnv(): NotificationProvider[] {
    const channels = process.env.NOTIFICATION_CHANNELS?.split(',') || ['wechat'];
    return channels.map(channel => {
      const prefix = `${channel.toUpperCase()}_`;
      const config: NotificationConfig = {
        // 确保 channelType 是 "wechat" | "dingtalk" | "telegram" 中的一个
        channelType: channel as "wechat" | "dingtalk" | "telegram",
        baseConfig: {
          timeout: parseInt(process.env[prefix + 'TIMEOUT'] || '5000'),
          retries: parseInt(process.env[prefix + 'RETRIES'] || '3')
        },
        channelConfig: Object.keys(process.env)
          .filter(k => k.startsWith(prefix))
          .reduce((cfg, k) => ({
            ...cfg,
            [k.replace(prefix, '')]: process.env[k]
          }), {})
      };
      return this.create(config);
    });
  }
}