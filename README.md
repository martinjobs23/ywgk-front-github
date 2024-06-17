# 运维全过程安全管控系统

[TOC]

## 一、项目环境

### 1、基本软件版本

后端：

- MySQL：MySQL Server 8.0（非必须）
- JDK：11
- Maven：apache-maven-3.8.6（非必须）
- Tomcat：apache-tomcat-9.0.68（非必须）

前端：

- Vue
- npm：9.5.1

### 2、IDE 使用

- 后端：IDEA
- 前段：vscode
- 数据库：Navicat

## 二、项目结构

### 1、summer-framework 框架

主要提供基本的项目底层结构，将数据通信方式、异常信息返回等等进行了处理，通常需要打包为 jar 包放入本地 Maven 仓库，在后端便可进行使用。目前使用1.0.14版本，手动maven仓库安装提供版本（待调试）

### 2、admin 后端

负责前后端通信，读取数据库，基于 `summer`框架便于进行一些底层操作。使用 GPRC 与 Control Center 进行通信，CC 端也属于后端，当后端需要将策略等信息进行下发时，需用 GRPC 将相关信息发送给 CC 端，由 CC 端与各个终端进行通信，另外需要注意，CC 端与后端都具备读写数据库的能力，具体数据库操作可根据实际情况选择在哪里进行操作。

### 4、front 前端

前段页面，主要用于数据的展示和部分数据的处理总结，用户能够通过网页端进行访问，进而进行数据库的增删改查，进而对系统相关内容产生相应的影响。

## 三、项目部署复现

### 1、项目文件目录结构

- summer-framework：summer 框架，底层需要打包放入本地 maven 仓库
- ipam-admin：后端程序，用于为前端页面提供数据
- ipam-front：前端页面，使用 vue 进行运行，需要使用 npm 命令

### 2、部署过程

配置相关的环境基础，安装配置 JDK11、Maven、Vue，安装相关的软件，例如后端需要使用 IDEA 进行开发，前段使用 VScode 进行，也可使用 IDEA，但是推荐使用 vscode，因为 vscode 进行格式化插件比较好用，数据库读取工具使用 Navicat 等工具均可，虚拟机连接使用 xshell

~~首先打开 summer-framework 文件夹，该文件夹内容为 summer 框架，需要将 summer 框架打包为 jar 包放入本地 maven 的仓库（repository），步骤为：首先点开右侧 maven 选项卡->（双击 clean 视情况可省略）双击 compile->双击 package->双击 install，至此框架就打包好放入了 maven 的仓库。注意，此处一定要查看项目的配置，即项目的 idea 配置，搜索 maven 查看 maven 仓库是否设置正确，不同项目需要使用同一个仓库，这样才能读取到包。~~

使用 IDEA 打开 ipam-admin，分别更新 pom.xml 文件，看所有依赖是否能够进行加载。如果出现大量爆红，即使不出现大量爆红，也需要进行此步骤：打开右侧 maven 选项卡->双击 clean->找到 Plugins 下的 protobuf，首先双击以下的 protobuf:compile，再双击 protobuf-custom，生成文件在 target 目录中。然后检查 application.properties，此文件为该后端的配置文件，在运行前需要选择 Tomcat 本地服务器，点击 IDEA 右上角 Edit Configuration，选择本地的 Tomcat 服务器，在 Server 的 URL 中需要更改为 http://localhost:8080/summer/，需要注意的是下侧的 Application context 内容需要是/summer。最后建议检查 IDEA 的配置是否正确，例如 Project Structure，目录结构是否识别正确（例如 Resources 类型经常在 Control_Center 端无法正常被识别，同时需要检查的还有 maven 仓库、JDK 版本是否正确，本项目的 JDK 版本是否选择正确。最后点击运行即可。

使用 vscode 打开 ipam-front，此文件夹为该系统的前端页面，在配置好的 vue 的前提下，在 vscode 命令行输入 npm run serve，需要手动下载提供的 node_modules 文件夹放到项目根目录下，此文件夹占用空间较大，小文件较多，如果检测出无法正常进行安装，需要使用 npm install 命令进行安装相关依赖。




