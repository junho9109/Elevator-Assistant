import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// GET 쿼리에서 흔히 쓰는 "fetch 후 그대로 .json()" 패턴을 안전하게 감싼 헬퍼.
// 서버가 500 등 에러를 내도 본문은 유효한 JSON({error: ...})인 경우가 많아서,
// r.ok 체크 없이 r.json()만 하면 에러 객체가 그대로 배열 자리에 들어가 화면이
// "X.map is not a function" 식으로 통째로 크래시한다. 여기서 throw하면
// react-query가 에러 상태로 처리하고, 컴포넌트의 `data: x = []` 기본값이
// 정상적으로 적용되어 일시적 오류에도 화면이 죽지 않는다.
export async function fetchJson<T = any>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  await throwIfResNotOk(res);
  return res.json();
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
