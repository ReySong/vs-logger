<center><h1><b> VSC-Logger </b></h1></center>

简体中文 | [English](./README-en.md) 

VSC Logger 是一个 vscode 插件，它为 JS/TS 提供了一些有关控制台操作的快捷方式。

## 用途
### 快速插入 console 语句  

提供两种插入方式：
1. 使用右键菜单
2. 使用快捷键  

| 插入语句 | 菜单选项 | windows 快捷键 | mac 快捷键 |
| :----:| :----: | :----: | :----: |
| console.log | Console Log All Selections | alt + c | option + c |
| console.error | Console Error All Selections | alt + e | option + e |
| console.warn | Console Warn All Selections | alt + w | option + w |

### 清除所有 console.log 语句
一键清除当前文件中的所有 console.log 语句（包括自定义的 console.log 语句）
| 菜单选项 | windows 快捷键 | mac 快捷键 |
| :----:| :----: | :----: |
| Clear All Logs | ctrl + alt + c | ctrl + option + c |

## 扩展设置
此插件提供以下设置：
* `console log`：配置自定义 console log 函数
* `console error`：配置自定义 console error 函数
* `console warn`：配置自定义 console warn 函数

