import { useState } from "react"

export function CreateElection() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

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
    </main>
}
