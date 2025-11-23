import { useState } from "react"
import { Turnstile } from "../components/Turnstile";

let unique_counter = 0;

export function CreateElection() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [options, setOptions] = useState<{ name: string, unique: number }[]>([]);
    const [newOptionName, setNewOptionName] = useState<string>("");
    const [password, setPassword] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function send() {
        if(!token) return;

        const payload: {
            title: string;
            description: string;
            options: {name:string}[];
            password: string | null;
            "cf-turnstile-response": string;
        } = {
            title, description, options, password,
            "cf-turnstile-response": token
        };

        const create_result = await fetch(new URL("/elections", process.env.SERVER_ORIGIN), {
            method: "post",
            body: JSON.stringify(payload),
        }).catch(() => null);

         // TODO: UX改善
        if(!create_result) {
            alert("通信エラーが発生しました");
        } else if(create_result.ok) {
            alert("成功しました");
        } else {
            const error_result = await create_result.json().catch(() => null);
            if(!error_result) {
                alert("内部エラーが発生しました");
            } else {
                alert(`エラー: ${error_result.error}`);
            }
        }
    }

    return <main className="create-election">
        <h2>投票箱を作る</h2>
        <form onSubmit={send}>
            <label>
                タイトル: <br />
                <input required type="text" name="title" maxLength={128} value={title} onChange={e=>setTitle(e.target.value)} />
            </label>
            <br />
            <label>
                説明: <br />
                <textarea required name="description" maxLength={1024} value={description} onChange={e=>setDescription(e.target.value)} />
            </label>
            <br />
            選択肢: <br />
            <ul>
                {options.map((option, i) => <li key={option.unique}>
                    <button className="remove" onClick={() => setOptions(options.toSpliced(i, 1))}>X</button>
                    <input required type="text" name="option" maxLength={128} value={option.name} onChange={e => {
                        option.name = e.target.value;
                        setOptions([...options]);
                    }} />
                </li>)}
                <button className="add" disabled={options.length >= 16} onClick={() => {
                    if (options.length >= 16) return;
                    setOptions([...options, { name: newOptionName, unique: unique_counter++ }]);
                    setNewOptionName("");
                }}>
                    +
                </button>
                <input
                    type="text"
                    name="new-option"
                    disabled={options.length >= 16}
                    value={newOptionName}
                    onChange={e=>setNewOptionName(e.target.value)}
                />
                { options.length >= 16 && <small>選択肢は16個までです</small> }
            </ul>
            <div>
                パスワード
                <input type="checkbox" name="password_enable" checked={password !== null} onChange={e => e.target.checked ? setPassword("") : setPassword(null)} />
                :
                <br />
                <input type="password" name="password" disabled={password === null} value={password ?? ""} onChange={e => setPassword(e.target.value)} />
            </div>
            <br />
            <Turnstile onSuccess={setToken} />
            <input type="submit" value="作成" />
        </form>
    </main>
}
