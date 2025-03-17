# 使用 Ubuntu 24.04 作為基底映像檔
FROM ubuntu:24.04

# 設定非互動模式，避免 apt-get 安裝時卡住
ENV DEBIAN_FRONTEND=noninteractive

# 更新 apt 資料庫，並安裝 OpenJDK 11
RUN apt-get update && apt-get install -y openjdk-21-jdk \
  && rm -rf /var/lib/apt/lists/*   
# 安裝後清理 apt-cache，減少映像檔體積

# 定義 ENV_USER
ENV ENV_USER=service
# 添加使用者和權限設定
# 建立ssh登入帳號(建密碼 useradd 帳號 -p $(perl -e 'print crypt($ARGV[0], "password")' 密碼 \)
# 創建一個 ENV_USER 的新用戶
# -m 自動建立家目錄，-s 指定預設 shell 為 bash
RUN useradd -m -s /bin/bash ${ENV_USER} \
  # 將新建立的 ENV_USER 加入到 adm,sudo 組中，-a 代表用戶附加到指令的組，不是替換現有的組
  # adm 通常授予用戶查看系統日誌的權限
  # sudo 允許用戶使用 sudo 命令來執行管理員級別的操作
  && usermod -a -G adm,sudo ${ENV_USER} \
  # 為新用戶設定默認的 shell (/bin/bash)
  && usermod -s /bin/bash ${ENV_USER} \
  # 設定 ENV_USER 的家目錄，所有權設定為 ENV_USER
  && chown -R ${ENV_USER}:${ENV_USER} /home/${ENV_USER} \
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

# 預先建立 .vscode-server 目錄並設定權限，讓 VSCode 能夠在此目錄下建立檔案
# 建立 .vscode-server 目錄
RUN mkdir -p /home/${ENV_USER}/.vscode-server && \
  # 將目錄權限設定為 service
  chown -R ${ENV_USER}:${ENV_USER} /home/${ENV_USER}/.vscode-server


# Setting root password
RUN echo "${ENV_USER}:@@apicourse!!" | chpasswd

# 切換到非 root 使用者，確保後續操作以較低權限運行
USER ${ENV_USER}

# 啟動 spring boot
CMD ["./gradlew", "bootRun"]