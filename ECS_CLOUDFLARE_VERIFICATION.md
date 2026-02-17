# ECS + Cloudflare 收口验证清单

请按以下步骤在 ECS 与 Cloudflare 上逐条执行，并将结果贴到本文件或单独保存，便于排查 503 / Failed to fetch。

---

## Step 1｜ECS 必查

### 1.1 安全组

在阿里云 ECS 控制台 → 实例 → 安全组 → 配置规则：

| 端口 | 授权对象 | 说明 |
|------|----------|------|
| 80 / 443 | 0.0.0.0/0 | 对公网放行，供 Nginx 与 Cloudflare 回源 |
| 8000 | 127.0.0.1/32（或内网网段） | **仅本机或内网**，前端不直连 8000 |

**请确认后打勾：**  
- [ ] 80、443 已对 0.0.0.0/0 放行  
- [ ] 8000 仅对 127.0.0.1 或内网放行（不对 0.0.0.0/0）

### 1.2 Nginx 反代配置

要求：前端永远不直连 8000，8000 只作为内部服务，由 Nginx 监听 80（及可选的 443）并反代到 127.0.0.1:8000。

在 ECS 上执行：

```bash
# 查看 Nginx 配置（路径以实际为准）
cat /etc/nginx/nginx.conf
cat /etc/nginx/conf.d/*.conf
# 或
grep -r "api.userinsightagent" /etc/nginx/
```

确认存在等价逻辑（不要求一模一样，行为一致即可）：

```nginx
server {
    listen 80;
    server_name api.userinsightagent.myrawzm0406.online;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**请确认：**  
- [ ] `server_name` 为 `api.userinsightagent.myrawzm0406.online`  
- [ ] `proxy_pass` 指向 `http://127.0.0.1:8000`  
- [ ] 已执行 `nginx -t` 且 `reload` 生效  

### 1.3 ECS 上执行（必须贴结果）

在 ECS 上逐条执行并**把完整输出贴出来**：

```bash
# 1）本机直连 8000（应 200）
curl -I http://127.0.0.1:8000/docs

# 2）通过 Nginx 本机 Host（应 200）
curl -I -H "Host: api.userinsightagent.myrawzm0406.online" http://127.0.0.1/docs
# 若 Nginx 只监听 80 且无 default_server，可能用：
curl -I http://localhost/docs

# 3）通过域名（在 ECS 上解析到本机时，应 200）
curl -I http://api.userinsightagent.myrawzm0406.online/docs
```

**请贴出三条命令的完整输出（含 HTTP 状态行）：**

```
# curl -I http://127.0.0.1:8000/docs
（粘贴）

# curl -I http://localhost/docs 或 curl -I -H "Host: api.userinsightagent.myrawzm0406.online" http://127.0.0.1/docs
（粘贴）

# curl -I http://api.userinsightagent.myrawzm0406.online/docs
（粘贴）
```

---

## Step 2｜Cloudflare 必查（503 最大嫌疑点）

### 2.1 DNS 记录

- 记录名：`api`（或 `api.userinsightagent.myrawzm0406.online`，视域名托管方式而定）
- 目标：`api.userinsightagent.myrawzm0406.online`  
- **橙云代理（Proxy status）：开启**（Proxied）  
- 回源 IP：ECS 公网 IP  
- **回源端口：80 或 443**（Cloudflare 默认只回源 80/443）  
- ❌ **不允许** Cloudflare 直连 8000

**请确认：**  
- [ ] 橙云代理已开启  
- [ ] 回源为 ECS 公网 IP  
- [ ] 回源端口为 80（或 443），不是 8000  

### 2.2 SSL/TLS 模式

在 Cloudflare → SSL/TLS → Overview：

- **Flexible**：浏览器 → Cloudflare 为 HTTPS，Cloudflare → ECS 为 HTTP（端口 80）。若 ECS 上 Nginx 只监听 80，选 Flexible 即可。  
- **Full**：Cloudflare → ECS 用 HTTPS（需 ECS 有证书）。  
- **Full (strict)**：同上且证书需受信任。

**请写明当前模式：** _____________  
若为 Flexible，说明：HTTPS → HTTP 是否符合预期（用户访问 https://api...，回源 http://ECS:80）：_____

### 2.3 浏览器实测

- 打开：**https://api.userinsightagent.myrawzm0406.online/docs**  
- 结果：返回 **200** / 301 / 503？ _____________  
- 打开开发者工具 → Network，查看该请求响应头是否含 **cf-ray**（Cloudflare Ray ID）：是 / 否 _____________

---

## Step 3｜前端兜底（已实现）

- `getDefaultApiBase()`：localhost/127.0.0.1 → `http://127.0.0.1:8000`；非 localhost → `https://api.userinsightagent.myrawzm0406.online`。  
- fetch 报错时：输出区显示 `errBackend`，明确写「请点击下方「设置API地址」」。  
- 设置 API 地址弹窗：生产环境填 `https://api.userinsightagent.myrawzm0406.online`（不填 :8000）；本机填 `http://127.0.0.1:8000`。  
- 无 silent fail：runA/runB 的 catch 均将错误写入输出区并提示点击「设置API地址」。

---

## Step 4｜最终验收

- **可访问链接（预期 200）：** https://api.userinsightagent.myrawzm0406.online/docs  
- **前端：** 未手动设置 API Base 时，打开 https://userinsightagent.myrawzm0406.online，点击 Run A / Run B，**不出现 Failed to fetch**。  

**结论：**  
现在用户只需要打开 https://userinsightagent.myrawzm0406.online 即可正常调用 ECS 后端，无需额外配置。

---

## Step 5｜GitHub 同步

- 执行：`git push origin main`  
- 确认 commit：`eff1cab`（或最新包含上述前端/文档改动的 commit）  
- 线上前端：hard refresh 后查看源代码能看到新文案（apiBaseHint、errBackend、setApiBasePrompt 等）。
