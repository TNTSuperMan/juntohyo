type ErrorCodes =
    | "BAD_REQUEST"
    | "INCORRECT_REQUEST"
    | "SERVER_ERROR"
    | "INVALID_TURNSTILE"
    | "CONFLICT_ID"
    | "TOO_MANY_REQUEST"

export const default_errmap: Record<ErrorCodes, string> = {
    BAD_REQUEST: "不正なリクエストです",
    INCORRECT_REQUEST: "間違ったリクエストです",
    SERVER_ERROR: "サーバーエラーが発生しました",
    INVALID_TURNSTILE: "Cloudflare Turnstile認証に失敗しました",
    CONFLICT_ID: "内部でIDが重複しました",
    TOO_MANY_REQUEST: "リクエストが多いため、数分後に試行してください"
}

export const fetch_e = async (input: URL | RequestInfo, init?: RequestInit, errmap = default_errmap): Promise<Response | string> => {
    const response = await fetch(input, init).catch(() => null);

    if (response === null) {
        return "通信エラーが発生しました";
    } else if(response.ok) {
        return response;
    } else {
        const body = await response.json().catch(() => null) as { error: ErrorCodes } | null;
        if (body === null) {
            if (response.status.toString()[0] === "5") {
                return "サーバーエラーが発生しました";
            } else {
                return "エラーが発生しました";
            }
        } else return errmap[body.error] ?? "エラーが発生しました";
    }
}
