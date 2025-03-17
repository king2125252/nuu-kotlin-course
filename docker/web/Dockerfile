# ubuntu24.04 <-> python3
# 使用最新的 Ubuntu LTS 當作基礎IMAGE
FROM ubuntu:24.04

# 設定環境變數，避免安裝過程中出現互動訊息
ENV EDBIAN_FRONTEND=nonineractive

# 設定時區
RUN apt-get update && apt-get install -y --no-install-recommends tzdata \
  && TZ=Asia/Taipei \
  && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone \
  && dpkg-reconfigure -f noninteractive tzdata

# 更新 apt 資料庫並安裝基本工具
# rm -rf /var/lib/apt/lists/* 清理不必要的檔案，以減少容器大小
RUN apt-get update && apt-get install -y \
  apt-utils \
  curl \
  vim \
  nginx \
  curl \
  git \
  tmux \
  && rm -rf /var/lib/apt/lists/*

# 定義 ENV_USER
ENV ENV_USER=service
# 添加使用者和權限設定
# 建立ssh登入帳號(建密碼 useradd 帳號 -p $(perl -e 'print crypt($ARGV[0], "password")' 密碼 \)
# 創建一個 ENV_USER 的新用戶
RUN useradd ${ENV_USER} \
  # 將新建立的 ENV_USER 加入到 adm,sudo 組中，-a 代表用戶附加到指令的組，不是替換現有的組
  # adm 通常授予用戶查看系統日誌的權限
  # sudo 允許用戶使用 sudo 命令來執行管理員級別的操作
  && usermod -a -G adm,sudo ${ENV_USER} \
  # 為新用戶設定默認的 shell (/bin/bash)
  && usermod -s /bin/bash ${ENV_USER} \
  # 創建 ENV_USER 家目錄
  && mkdir /home/${ENV_USER} \
  # 設定 ENV_USER 的家目錄，所有權設定為 root 和 ENV_USER 用戶組
  && chown root:${ENV_USER} /home/${ENV_USER} \
  # 將 $ENV_USER 家目錄，設定為 755
  # 7(rwx) 擁有組 可 讀寫執行
  # 5(r-x) 用戶組 可 讀  執行
  # 7(r-x) 其他用戶 可 讀  執行
  && chmod 755 /home/${ENV_USER} \
  && cd /home/${ENV_USER} \
  # 建立緩存資料夾
  && mkdir .cache .npm \
  # 緩存資料夾，權限設定為 ENV_USER
  && chown ${ENV_USER}:${ENV_USER} .cache .npm

# download node npm nvm
# reference https://nodejs.org/zh-tw/download
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" && \
    nvm install 22 && \
    nvm alias default 22 && \
    nvm use 22

# 確保 Node.js 可用
RUN export NVM_DIR="$HOME/.nvm" && \
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
node -v && npm -v

# 複製 nginx 配置文件
ARG ARG_NGINX_ENV_CONF
COPY ${ARG_NGINX_ENV_CONF} /etc/nginx/conf.d/default.conf
# 將 nginx 配置文件 /var/www/html，改為 ARG_SITE_DOCUMENT_ROOT
ARG ARG_SITE_DOCUMENT_ROOT
RUN sed -ri "s|/var/www/html|${ARG_SITE_DOCUMENT_ROOT}|" /etc/nginx/conf.d/default.conf

# 複製入口文件到容器內
COPY ./entrypoint.sh /entrypoint.sh
# 確保可以執行
RUN chmod +x /entrypoint.sh
# 切換到 service 用戶，確保後續命令以非 root 身份執行
# USER ${ENV_USER}
# 設置入口文件
ENTRYPOINT ["/entrypoint.sh"]