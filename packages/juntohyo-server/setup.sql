CREATE TABLE votes (
    id INTEGER PRIMARY KEY,
    voted_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    election BLOB NOT NULL,
    choice INTEGER NOT NULL,
    ip_hash BLOB NOT NULL,
);

CREATE INDEX index_votes_election ON votes(election);
