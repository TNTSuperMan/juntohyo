import type { ErrorCodes, ErrorResponse } from "juntohyo-abstract-server/src/utils/error";
import { useMemo } from "react";

export function ErrorView({ error, additional }: { error?: ErrorResponse | null, additional?: { [key in ErrorCodes]?: string } }) {
    const table = useMemo<{ [key in ErrorCodes]: string }>(() => ({
        BAD_REQUEST: "不正なリクエストです",
        INCORRECT_REQUEST: "間違ったリクエストです",
        SERVER_ERROR: "サーバーエラーが発生しました",
        INVALID_TURNSTILE: "Cloudflare Turnstile認証に失敗しました",
        CONFLICT_ID: "内部で生成したコードが衝突しました",
        TOO_MANY_REQUEST: "リクエストが多すぎます",
        ...additional
    }), [additional]);

    if (!error) {
        return null;
    } else {
        return <span className="error">{ table[error.code] }</span>
    }
}
