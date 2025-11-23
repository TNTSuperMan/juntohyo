import { Link } from "react-router-dom";

export function Index() {
    return <main>
        <p>簡単に使える投票アプリ。</p>
        <ul className="inline">
            <li>登録不要</li>
            <li>シンプル</li>
            <li>無料</li>
        </ul>
        <p>投票箱を作ってみましょう。</p>
        <Link className="button" to="/create-election">投票箱を作成</Link>
    </main>
}
