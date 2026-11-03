// OpenAI 임베딩 생성 헬퍼 — 정정 카드처럼 새로 만드는 모듈이 공유한다.
// (네트워크가 막혀 있어도 무한 대기하지 않도록 8초 타임아웃. 실패하면 null)
export async function getEmbedding(text: string): Promise<number[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000) }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(`[임베딩] OpenAI 응답 오류 status=${resp.status}:`, errText.slice(0, 300));
      return null;
    }
    const data = await resp.json();
    return data?.data?.[0]?.embedding || null;
  } catch (e) {
    console.error("[임베딩] 생성 실패:", e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
