export interface NotificationProvider {
  sendMessage(message: NotificationMessage): Promise<void>;
}

export interface NotificationMessage {
  title: string;
  content: string;
  type: 'text' | 'markdown' | 'html';
  receiver?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface NotificationConfig {
  channelType: 'wechat' | 'dingtalk' | 'telegram';
  baseConfig: {
    timeout?: number;
    retries?: number;
  };
  channelConfig: {
    [key: string]: any;
  };
}