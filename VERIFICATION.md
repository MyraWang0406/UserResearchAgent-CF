# 可验证验收说明

## 1) 具体改动文件与 diff

- **改动文件：** `frontend/index.html`、`README.md`
- **完整 diff（相对 35a9c04 的父提交到当前 30f0bb8）：** 见下或执行 `git diff 35a9c04^..30f0bb8 -- frontend/index.html` 查看。

### frontend/index.html 变更摘要

| 项 | 说明 |
|----|------|
| B1 增长驱动 | `<textarea id="growth">` 改为 `<div id="growthOptions" class="growth-checkboxes">`，由 `applyLang()` 用 `growthOptions` 渲染 checkbox；`readInput()` 从勾选项收集 `growth_driver: string[]`；切换语言保留勾选状态。 |
| B2 业务定位 | `positioningOptions` 中 `validated` / `new_market` 的 zh/en 文案已替换为新版（已论证价值、旧用户新供给/新交易场）。 |
| B3 本次目标 | `goalOptions` 新增 `leads_hva`（筛选清洗有效线索 提升高价值行为(HVA)数 / Filter/clean quality leads; increase High Value Action (HVA) count）。 |
| B4 联系作者 | `.contact-badge` 背景由 `var(--accent-main)` 改为 `#2b2b2b`，hover `#1f1f1f`，边框/阴影改为灰。 |

## 2) 当前 main 分支最新 commit

- **拉取后本地 main 最新：** `30f0bb8`（Fix growth drivers UI + copy updates + contact button style）
- **上一笔：** `35a9c04`（feat: growth drivers as multi-select; positioning/goal copy and new goal option）

若 push 时网络失败，请在可访问 GitHub 时执行：

```bash
git push origin main
```

推送成功后，远端 main 的最新 commit 即为 `30f0bb8`（或你本地显示的 hash）。

## 3) 线上页面实际使用的文件/构建产物路径

- **前端入口（二选一，内容一致）：**  
  - **`frontend/index.html`**（推荐：部署时 Root/Output = `frontend`）  
  - **根目录 `index.html`**（与 frontend 内容一致，供“以仓库根为站点根”的部署使用）
- **无构建：** 无 `package.json` 前端构建、无 `dist/` 或 `build/` 产出；CI 仅跑 pytest，无前端打包。
- **结论：** 若部署使用**仓库根目录**为站点根，则首页会读 **根目录 `index.html`**（已与 frontend 一致）。若部署使用 **`frontend`** 为站点根，则首页为 **`frontend/index.html`**。详见 **DEPLOYMENT.md**。

## 4) 本地可复现验证步骤

1. **拉取并确认分支与 commit：**
   ```bash
   git checkout main
   git pull
   git log -1 --oneline
   ```
   应看到 `30f0bb8 Fix growth drivers UI + copy updates + contact button style`（或 push 后的最新 hash）。

2. **启动本地服务：**
   - Windows：在项目根目录双击或执行 `start.bat`
   - 或手动：
     - 后端：`uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000`
     - 前端：`python -m http.server 5173 --directory frontend`

3. **打开页面：** 浏览器访问 **http://127.0.0.1:5173/index.html**

4. **验收清单：**
   - [ ] **增长驱动方式**：为多选 checkbox 组（MLG/OLG/PLG/SLG/TLG），不是 textarea。
   - [ ] **业务定位**：下拉中可见「已论证价值：已确认供需匹配成立…」与「旧用户新供给/新交易场：发现历史用户有别的需求待满足…」。
   - [ ] **本次目标**：下拉中可见「筛选清洗有效线索 提升高价值行为(HVA)数」。
   - [ ] **联系作者**：右下角联系作者为黑灰底（#2b2b2b）、白字，hover 更深（#1f1f1f），非蓝色。

5. **（可选）截图：** 对上述四项各截一张图保存，便于与线上对比。

### 线上无痕验收（部署生效后）

1. 打开**无痕/隐私窗口**，访问 **https://userinsightagent.myrawzm0406.online/**（或你配置的线上域名）。
2. 若部署源为本仓库 main 且目录正确（见 DEPLOYMENT.md），应看到：  
   - 增长驱动方式为 **checkbox 组**；业务定位含「已论证价值」「旧用户新供给/新交易场」；本次目标含 **HVA** 项；右下角联系作者为**黑灰底**。
3. 若仍为旧 UI：到 Cloudflare Pages / GitHub Pages 确认 **Connected Repo = MyraWang0406/UserResearchAgent**、**Branch = main**、**Root/Output = `frontend` 或 `/`（根）**，保存后**重新部署**，再强刷/无痕访问。

## 5) 部署入口说明

已在 **README.md** 增加「前端入口与部署说明」：入口为 `frontend/index.html`，本地预览命令与地址，以及线上托管需指向 main 且根目录为 `frontend`（或首页为 `frontend/index.html`）的说明。
