---
title: 安装 Rust
published: 2026-03-30 18:59
tags:
  - Rust
  - 环境配置
category: 编程语言/Rust
description: 安装 Rust
---


# [安装 Rust](https://beatai.org/rust-course/first-try/installation)

`rustup` 是 Rust 的安装程序，也是它的版本管理程序。 强烈建议使用 `rustup` 来安装 Rust，当然如果你有异心，请寻找其它安装方式，然后再从下一节开始阅读。

haha，开个玩笑。读者乃大大，怎么能弃之不顾。

注意：如果你不想用或者不能用 rustup，请参见 Rust 其它安装方法。

至于版本，现在 Rust 稳定版特性越来越全了，因此下载最新稳定版本即可。由于你用的 Rust 版本可能跟本书写作时不一样，一些编译错误和警告可能也会有所不同。

------

## 🌟 极其重要：自定义安装路径（避免 C 盘 / 系统盘爆满）

默认情况下，`rustup` 会将所有的编译器工具链、第三方库（Crates）缓存等大文件全部安装在当前用户的目录下：

- **工具链目录：** `~/.rustup`
- **包管理器目录：** `~/.cargo`

在 Windows 系统上，这通常意味着它们会深扎在 `C:\Users\你的用户名` 下。随着开发的深入，这两个文件夹动辄会占用十几个 GB 甚至几十 GB 的空间。为了保护你的系统盘，**请务必在执行下文的任何安装命令之前，配置好环境变量来修改路径**。

#### Windows 配置方法：

1. 在其他空间充裕的盘符（如 D 盘）创建好目标文件夹，例如 `D:\RustEnv\.rustup` 和 `D:\RustEnv\.cargo`。
2. 按下 `Win` 键搜索“环境变量”，选择 **“编辑系统环境变量”**，点击底部的 **“环境变量”** 按钮。
3. 在上方“用户变量”中，点击新建：
   - 变量名：`RUSTUP_HOME`，变量值：`D:\RustEnv\.rustup`
   - 变量名：`CARGO_HOME`，变量值：`D:\RustEnv\.cargo`
4. **⚠️ 关键一步：** 连续点击“确定”保存后，**必须重新打开一个新的终端窗口（CMD/PowerShell）**，再进行后续的安装。安装程序会自动读取这两个变量并安装到新路径。

#### Linux / macOS 配置方法：

在执行下文的安装脚本前，你可以将其写入你的 shell 配置文件（如 `~/.bashrc` 或 `~/.zshrc`），然后执行 `source` 使其生效：

Bash

```
export RUSTUP_HOME=/你的自定义路径/.rustup
export CARGO_HOME=/你的自定义路径/.cargo
```

------

## 在 Linux 或 macOS 上安装 rustup

打开终端并输入下面命令：

Bash

```
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

这个命令将下载一个脚本并开始安装 `rustup` 工具，此工具将安装 Rust 的最新稳定版本。可能会提示你输入管理员密码。

如果安装成功，将出现下面这行：

Plaintext

```
Rust is installed now. Great!
```

OK，这样就已经完成 Rust 安装啦。

**安装 C 语言编译器：（非必需）**

Rust 对运行环境的依赖和 Go 语言很像，几乎所有环境都可以无需安装任何依赖直接运行。但是，Rust 会依赖 `libc` 和链接器 `linker`。所以如果遇到了提示链接器无法执行的错误，你需要再手动安装一个 C 语言编译器：

- **macOS 下：**

  Bash

  ```
  $ xcode-select --install
  ```

- **Linux 下：**

  Linux 用户一般应按照相应发行版的文档来安装 `GCC` 或 `Clang`。 例如，如果你使用 Ubuntu，则可安装 `build-essential`。

  

  

------

## 在 FreeBSD 上安装 rustup

使用 pkg 安装：



Bash

```
# pkg install rustup-init
```

使用 Ports 安装：



Bash

```
# cd /usr/ports/devel/rustup-init/ 
# make install clean
```

------

## 在 Windows 上安装 rustup

Windows 上安装 Rust 需要有 `C++` 环境，以下为安装的两种方式：



#### 1. x86_64-pc-windows-msvc（官方推荐）

先安装 Microsoft C++ Build Tools，勾选安装 C++ 环境即可。安装时可自行修改缓存路径与安装路径，避免占用过多 C 盘空间。安装完成后，Rust 所需的 msvc 命令行程序需要手动添加到环境变量中，否则安装 Rust 时 `rustup-init` 会提示未安装 Microsoft C++ Build Tools，其位于：`%Visual Studio 安装位置%\VC\Tools\MSVC\%version%\bin\Hostx64\x64`（请自行替换其中的字段）下。

如果你不想这么做，可以选择安装 Microsoft C++ Build Tools 新增的“定制”终端 Developer Command Prompt for %Visual Studio version% 或 Developer PowerShell for %Visual Studio version%，在其中运行 `rustup-init.exe`。

准备好 C++ 环境后开始安装 Rust：

在 `RUSTUP-INIT` 下载系统相对应的 Rust 安装程序，一路默认即可。

PowerShell

```
PS C:\Users\Hehongyuan> rustup-init.exe......
Current installation options:

   default host triple: x86_64-pc-windows-msvc
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

#### 2. x86_64-pc-windows-gnu

相比于 MSVC 版本来说，GNU 版本具有更轻量，更靠近 Linux 的优势。

首先，根据 MSYS2 官网配置 MSYS。若您觉得下载太慢，可以试试由 Caviar-X 提供的代理。

在安装 `mingw-toolchain` 后，请将 `%MSYS 安装路径%\mingw64\bin` 添加到系统变量 `PATH` 中。



配置好后，在终端中输入下面命令（或运行下载的 `rustup-init.exe`）来安装 rustup。之后，根据以下输出进行配置：



Plaintext

```
Current installation options:

   default host triple: x86_64-pc-windows-msvc
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>2

I'm going to ask you the value of each of these installation options.
You may simply press the Enter key to leave unchanged.

Default host triple? [x86_64-pc-windows-msvc]
x86_64-pc-windows-gnu

Default toolchain? (stable/beta/nightly/none) [stable]
stable

Profile (which tools and data to install)? (minimal/default/complete) [default]
complete

Modify PATH variable? (Y/n)
Y

Current installation options:

   default host triple: x86_64-pc-windows-gnu
     default toolchain: stable
               profile: complete
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>
```

再之后，按下 `1`，等待。完成后，您就已经安装了 Rust 和 `rustup`。



------

## 更新

要更新 Rust，在终端执行以下命令即可更新：



Bash

```
$ rustup update
```

## 卸载

要卸载 Rust 和 `rustup`，在终端执行以下命令即可卸载：



Bash

```
$ rustup self uninstall
```

## 检查安装是否成功

检查是否正确安装了 Rust，可打开终端并输入下面这行，此时能看到最新发布的稳定版本的版本号、提交哈希值和提交日期：



Bash

```
$ rustc -V
rustc 1.56.1 (59eed8a2a 2021-11-01)

$ cargo -V
cargo 1.57.0 (b2e52d7ca 2021-10-21)
```

*注：若发现版本号不同，以您的实际最新版本号为准。*



恭喜，你已成功安装 Rust！



**如果没看到此信息：**



- 如果你使用的是 Windows，请检查刚才设置的自定义安装路径中的 `bin` 文件夹（例如 `D:\RustEnv\.cargo\bin`）是否已存在于 `%PATH%` 系统变量中。

  

  

- 如果你刚刚安装完毕或设置了环境变量，**请务必关闭并重新打开一个新的终端**，再次执行以上命令。

  

  

如果都正确，但 Rust 仍然无法正常工作，那么你可以在很多地方获得帮助。最简单的是加入 Rust 编程学院这个大家庭，QQ 群：1009730433。



## 本地文档

安装 Rust 的同时也会在本地安装一个文档服务，方便我们离线阅读：运行 `rustup doc` 让浏览器打开本地文档。

每当遇到标准库提供的类型或函数不知道怎么用时，都可以在 API 文档中查找到！具体参见 在标准库寻找你想要的内容。