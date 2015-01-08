文件夹 · 文件 · 结构
===================

```
root/                            # 工程根目录存放所有工程文件，诸如： .gitignore, package.json, gulpfile.js, .editorconfig 等。
├── [.git]
├── [doc]                        # 存放诸如：工程说明、指南、参阅资源等文档。
├── [node_modules]               # Node.js 模块存放处。
├── [dev]                        # 预处理文件目录。
│   ├── [splited_tasks_for_gulp] # 存放自动化任务脚本预处理文件。
│   ├── [stylesheets]            # 存放样式表预处理文件。
├── [dest]                       # 生成目录，存放各类按某种规则被处理后的 "*.js", "*.css" 等文件。
├── [gulp]                       # 存放自动化任务文件。
├── [test]                       # 存放测试用例脚本。
├── [tool]                       # 存放命令行批处理文件。
│   ├── [build]                  # 存放构建用命令行批处理文件。
│   ├── [cmprs]                  # 存放压缩用命令行批处理文件。
```
