import { useState, type FormEventHandler } from "react"
import { Turnstile } from "../components/Turnstile";
import { fetch_e } from "../utils/fetch";

let unique_counter = 0;

export function CreateElection() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [options, setOptions] = useState<{ name: string, unique: number }[]>([]);
    const [newOptionName, setNewOptionName] = useState<string>("");
    const [password, setPassword] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const send: FormEventHandler<HTMLFormElement> = async ev => {
        ev.preventDefault();

        setError(null);
        if(!token) return setError("Cloudflare Turnstile認証がされていません");

        const payload: {
            title: string;
            description: string;
            options: {name:string}[];
            password: string | null;
            "cf-turnstile-response": string;
        } = {
            title, description, password,
            options: options.map(e => ({ name: e.name })),
            "cf-turnstile-response": token
        };

        const res = await fetch_e(new URL("/elections", process.env.SERVER_ORIGIN), {
            method: "post",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        if (typeof res === "string") {
            setError(res);
        } else {
            // TODO: 成功時の挙動
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
            { error && <span className="error">{ error }</span> }
            <input type="submit" value="作成" />
        </form>
    </main>
}
