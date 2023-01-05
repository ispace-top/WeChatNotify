## 企业微信应用通知推送转发
[![Docker Image CI](https://github.com/kerwin162/WeChatNotify/actions/workflows/docker-image.yml/badge.svg)](https://github.com/kerwin162/WeChatNotify/actions/workflows/docker-image.yml)
### 一、说明

> 本人长期在使用群晖nas，但是群晖的通知推送只能推送到邮箱或者短信。看到网上前辈们将企业微信应用当做虚拟短信通知服务使用时茅塞顿开，于是就有了这个项目。

### 二、使用
1. #### Docker容器部署
   - ##### 拉取部署docker容器
   
     直接 docker run -p 端口:80 -it wechat_notify:last 就可以，端口填写你需要映射的端口就好。

   - ##### 需要配置环境变量

   > |  变量名   | 说明  |
   |  ----  | ----  |
   | CORP_ID  |  企业微信corpid| |
   | CORP_SECRET  | 企业微信应用的corpsecret |
   | AGENT_ID  | 企业微信应用的agentid |
   | THUMB_ID  | 如果是html模板需要显示的图片id.(请自行百度企业微信获取图片资源的media_id方法) |
   | TO_USER  | 要发送给的用户，参见企业微信应用获取 |
   | AUTHOR  | 没啥用，可以不配，就是显示推送者信息 |
   | URL  | 同样没啥用，就是点击可以进去的url，可以不配 |
   
2. #### 群晖设置

   - ##### 控制面板——通知设置——短信

      <img src="pic/step-1.png" width="320px" />

   - ##### 新增短信服务商；名称自己随便起，测试网址填入步骤1的容器地址和映射的端口。

   <img src="pic/step-2.png" width="320px" />

   例如：http://192.168.10.15:2180/notify/nas?title=title&info=hello world&p=


#### 三、版本更新说明
|  版本   | 说明  |
|  ----  | ----  |
| v1.0  | 为增加环境变量版本，可以配置上述全部变量|
| v1.0.1 | 为替换了镜像底包，将Docker镜像由之前的335MB缩减至49MB|

#### 四、发布地址
- Github源码：https://github.com/kerwin162/WeChatNotify
- Docker-Hub镜像地址：https://hub.docker.com/r/blackheads/wechat_notify

