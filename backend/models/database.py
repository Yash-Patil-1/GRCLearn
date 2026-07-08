"""SQLite for user state — risk register, progress, bookmarks, notes, audit findings."""

import sqlite3
from pathlib import Path

DB_DIR = Path(__file__).parent.parent.parent / "data" / "database"
DB_PATH = DB_DIR / "grclearn.db"


def get_connection() -> sqlite3.Connection:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


async def init_db():
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            total_xp INTEGER NOT NULL DEFAULT 0,
            current_streak INTEGER NOT NULL DEFAULT 0,
            longest_streak INTEGER NOT NULL DEFAULT 0,
            last_active_date TEXT
        );
        INSERT OR IGNORE INTO user_stats (id) VALUES (1);

        CREATE TABLE IF NOT EXISTS daily_activity (
            date TEXT PRIMARY KEY,
            xp INTEGER NOT NULL DEFAULT 0,
            lessons INTEGER NOT NULL DEFAULT 0,
            quizzes INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT NOT NULL,
            item_type TEXT NOT NULL,
            learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(item_id, item_type)
        );
        CREATE TABLE IF NOT EXISTS risk_register (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            description TEXT,
            likelihood INTEGER CHECK(likelihood BETWEEN 1 AND 5),
            impact INTEGER CHECK(impact BETWEEN 1 AND 5),
            risk_level TEXT,
            treatment TEXT,
            treatment_plan TEXT,
            owner TEXT,
            status TEXT DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT NOT NULL,
            item_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(item_id, item_type)
        );
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id TEXT,
            item_type TEXT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS audit_findings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            framework TEXT NOT NULL,
            control_id TEXT NOT NULL,
            status TEXT DEFAULT 'not_assessed',
            evidence TEXT,
            finding TEXT,
            remediation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS quiz_seen (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            framework TEXT NOT NULL,
            question_id TEXT NOT NULL,
            seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS quiz_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id TEXT NOT NULL,
            framework TEXT NOT NULL,
            correct INTEGER NOT NULL,
            user_answer TEXT,
            answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()
