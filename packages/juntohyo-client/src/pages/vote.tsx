import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { ErrorCodes, type ErrorResponse } from "juntohyo-abstract-server/src/utils/error";
import type { Option } from "juntohyo-abstract-server/src/types";
import { ErrorView } from "../components/Error";

export function Vote() {
    const { id } = useParams() as { id: string };
    const [election, setElection] = useState<{
        title: string, description: string, options: Option[],
    }>();
    const [error, setError] = useState<ErrorResponse>();

    useEffect(() => {
        setElection(undefined);
        server.elections[":id"].$get({
            param: { id },
        }).then(async election_response => {
            const res_json = await election_response.json().catch(() => ({ code: ErrorCodes.ServerError }));
            if ("code" in res_json) {
                setError(res_json);
            } else {
                setElection(res_json);
            }
        });
    }, [id]);

    if (election) {
        return <main className="vote">
            <h1>投票: {election.title}</h1>
            <pre className="description">
                { election.description }
            </pre>
        </main>
    } else {
        return <main className="vote">
            { error ? <ErrorView error={error} /> : "読込中..." }
        </main>
    }
}
