export default {
    async fetch(request) {
      const url = new URL(request.url)
  
      // 健康检查
      if (url.pathname === "/health") {
        return new Response(
          JSON.stringify({ ok: true, service: "user-research-agent" }),
          { headers: { "Content-Type": "application/json" } }
        )
      }
  
      // 你前端真正要打的 API
      if (url.pathname === "/api/diagnose" && request.method === "POST") {
        const body = await request.json()
  
        return new Response(
          JSON.stringify({
            success: true,
            input: body,
            result: "这里之后接你的 Agent 逻辑"
          }),
          { headers: { "Content-Type": "application/json" } }
        )
      }
  
      return new Response("Not Found", { status: 404 })
    }
  }
  