"""Tests for streak and XP logic."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient
from main import app
from models.database import get_connection


@pytest.fixture(autouse=True)
def clean_db():
    """Reset user_stats and daily_activity before each test."""
    conn = get_connection()
    conn.execute("DELETE FROM user_stats")
    conn.execute("DELETE FROM daily_activity")
    conn.execute("INSERT INTO user_stats (id, total_xp, current_streak, longest_streak, last_active_date) VALUES (1, 0, 0, 0, NULL)")
    conn.commit()
    conn.close()
    yield


def test_same_day_no_bump():
    """XP on same day should not increase streak."""
    from services.stats import award_xp, XP_QUIZ_CORRECT

    r1 = award_xp(XP_QUIZ_CORRECT, "quiz")
    assert r1["current_streak"] == 1

    r2 = award_xp(XP_QUIZ_CORRECT, "quiz")
    assert r2["current_streak"] == 1  # same day, no bump


def test_consecutive_day_bump():
    """XP on consecutive days should increase streak."""
    from services.stats import award_xp, XP_QUIZ_CORRECT

    # Day 1
    r1 = award_xp(XP_QUIZ_CORRECT, "quiz")

    # Manually set yesterday to simulate next day
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    conn = get_connection()
    conn.execute("UPDATE user_stats SET last_active_date = ?", (yesterday,))
    conn.commit()
    conn.close()

    r2 = award_xp(XP_QUIZ_CORRECT, "quiz")
    assert r2["current_streak"] == 2


def test_gap_resets_streak():
    """Missing a day should reset streak to 1."""
    from services.stats import award_xp, XP_QUIZ_CORRECT

    r1 = award_xp(XP_QUIZ_CORRECT, "quiz")

    # Simulate a 2-day gap
    two_days_ago = (date.today() - timedelta(days=2)).isoformat()
    conn = get_connection()
    conn.execute("UPDATE user_stats SET last_active_date = ?", (two_days_ago,))
    conn.commit()
    conn.close()

    r2 = award_xp(XP_QUIZ_CORRECT, "quiz")
    assert r2["current_streak"] == 1


def test_longest_never_decreases():
    """Longest streak should never decrease."""
    from services.stats import award_xp, XP_QUIZ_CORRECT

    # Build a streak of 3
    for day_offset in range(3):
        if day_offset > 0:
            past = (date.today() - timedelta(days=1)).isoformat() if day_offset == 1 else \
                   (date.today() - timedelta(days=2)).isoformat()
            conn = get_connection()
            conn.execute("UPDATE user_stats SET last_active_date = ?", (past,))
            conn.commit()
            conn.close()
        r = award_xp(XP_QUIZ_CORRECT, "quiz")

    assert r["longest_streak"] >= 2

    # Reset and verify longest stays at 2
    two_days_ago = (date.today() - timedelta(days=2)).isoformat()
    conn = get_connection()
    conn.execute("UPDATE user_stats SET last_active_date = ?", (two_days_ago,))
    conn.commit()
    conn.close()

    r = award_xp(XP_QUIZ_CORRECT, "quiz")
    assert r["longest_streak"] == 2
    assert r["current_streak"] == 1


class TestStreakAPI:
    def test_get_streak(self, client):
        # Clean up any leftover daily_activity from streak tests
        conn = get_connection()
        conn.execute("DELETE FROM user_stats")
        conn.execute("INSERT INTO user_stats (id, total_xp, current_streak, longest_streak, last_active_date) VALUES (1, 0, 0, 0, NULL)")
        conn.commit()
        conn.close()
        r = client.get("/api/streak")
        assert r.status_code == 200
        data = r.json()
        assert "total_xp" in data
        assert "current_streak" in data
        assert "daily_goal" in data
        assert "last_7_days" in data
        assert len(data["last_7_days"]) == 7


@pytest.fixture
def client():
    from main import app
    with TestClient(app) as c:
        yield c


def test_calculate_level():
    from services.stats import calculate_level

    assert calculate_level(0)["level"] == 1
    assert calculate_level(50)["level"] == 2
    assert calculate_level(120)["level"] == 3
    assert calculate_level(2000)["level"] == 10
    assert calculate_level(2000)["max_level_reached"] is True
    assert calculate_level(2500)["level"] == 10
