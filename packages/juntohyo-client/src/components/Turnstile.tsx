import { memo, useEffect, useState } from "react"

const RELOAD_INTERVAL_MS = 5000;

const enum State {
    BeforeCheck,
    Turnstile,
    ReloadFallback,
}

const TurnstileWidget = memo(() => <>
    <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
    />
    <div
        className="cf-turnstile"
        data-sitekey={process.env.TURNSTILE_SITEKEY}
        data-theme="light"
        data-size="normal"
        data-callback="onSuccess"
    ></div>
</>);

export function Turnstile({ onSuccess }: { onSuccess: (token: string) => void }) {
    const [state, setState] = useState<State>(State.BeforeCheck);
    const [last_updated, set_last_updated] = useState(Date.now());

    function loadTurnstile() {
        setState(State.Turnstile);
        //@ts-ignore
        globalThis.onSuccess = (token: string) => {
            onSuccess(token);
        }
    }

    function reload() {
        if(Date.now() > last_updated + RELOAD_INTERVAL_MS) {
            set_last_updated(Date.now());
            //@ts-ignore
            globalThis.turnstile?.reset();
        }
    }

    useEffect(() => {
        if(Date.now() < last_updated + RELOAD_INTERVAL_MS) {
            const timer = setTimeout(() => {
                set_last_updated(e => e + 1); // ほぼ変わらない
            }, (last_updated + RELOAD_INTERVAL_MS) - Date.now());
            return () => clearTimeout(timer);
        }
    }, [last_updated])

    switch(state) {
        case State.BeforeCheck: return <div className="turnstile">
                Cloudflare Turnstile認証が必要です。<br />
                続けますか？ <button onClick={loadTurnstile}>はい</button>
            </div>;
        case State.Turnstile: return <div className="turnstile active">
                <button disabled={Date.now() < last_updated + 5000} className="reload" onClick={reload}>再読み込みする</button>
                <TurnstileWidget />
            </div>
    }
}
