import { Link } from "react-router-dom";

export function Index() {
    return <main>
        <p>
            オープンソース、無料、登録不要、シンプル。<br />
            簡単に使える投票アプリ。
        </p>
        <Link className="create-button" to="/create-election">投票箱を作成</Link>
    </main>
}
