import { Router } from "./router";

export function App() {
    return <>
        <header>
            <h1>純投票</h1>
        </header>
        <Router />
        <footer>
            &copy; TNTSuperMan 2025
            <nav>
                <a href="/legal-info">利用規約・プライバシーポリシー等</a>
                <a target="_blank" href="https://github.com/TNTSuperMan/juntohyo">ソースコード</a>
            </nav>
        </footer>
    </>
}
