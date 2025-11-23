import { useState } from "react"

let unique_counter = 0;

export function CreateElection() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [options, setOptions] = useState<{ name: string, unique: number }[]>([]);
    const [newOptionName, setNewOptionName] = useState<string>("");
    const [password, setPassword] = useState<string | null>(null);

    return <main className="create-election">
        <h2>投票箱を作る</h2>
        <label>
            タイトル: <br />
            <input type="text" name="title" maxLength={128} value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
        <br />
        <label>
            説明: <br />
            <textarea name="description" maxLength={1024} value={description} onChange={e=>setDescription(e.target.value)} />
        </label>
        <br />
        選択肢: <br />
        <ul>
            {options.map((option, i) => <li key={option.unique}>
                <button className="remove" onClick={() => setOptions(options.toSpliced(i, 1))}>X</button>
                <input type="text" name="option" maxLength={128} value={option.name} onChange={e => {
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
        <input type="submit" value="作成" />
    </main>
}
