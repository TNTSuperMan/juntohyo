import { Router } from "./router";

export function App() {
    return <>
        <header>
            <h1>純投票</h1>
            <a href="/">ホーム</a>
            <a href="/legal-info">利用規約・プライバシーポリシー等</a>
            <a target="_blank" href="https://github.com/TNTSuperMan/juntohyo">ソースコード</a>
        </header>
        <Router />
        <footer>
            &copy; 2025 TNTSuperMan
        </footer>
    </>
}
