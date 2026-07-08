"""Tests for guided lessons API."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


class TestLessons:
    def test_list_lessons(self, client):
        r = client.get("/api/lessons")
        assert r.status_code == 200
        data = r.json()
        assert "lessons" in data
        assert len(data["lessons"]) >= 2  # at least governance + risk

    def test_get_lesson_sections(self, client):
        r = client.get("/api/lessons/phase1")
        assert r.status_code == 200
        data = r.json()
        assert len(data["sections"]) > 0
        assert "title" in data["sections"][0]
        assert "content" in data["sections"][0]

    def test_get_lesson_checkpoint_ids(self, client):
        r = client.get("/api/lessons/phase1")
        assert r.status_code == 200
        data = r.json()
        assert "checkpoint_question_ids" in data
        # Phase 1 maps to nist, iso27001, compliance — should have questions
        assert len(data["checkpoint_question_ids"]) > 0

    def test_get_lesson_phase2(self, client):
        r = client.get("/api/lessons/phase2")
        assert r.status_code == 200
        data = r.json()
        assert len(data["sections"]) > 0
        assert len(data["checkpoint_question_ids"]) > 0

    def test_lesson_not_found(self, client):
        r = client.get("/api/lessons/nonexistent")
        assert r.status_code == 404

    def test_complete_lesson(self, client):
        r = client.post("/api/lessons/phase1/complete")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "completed"
        assert data["xp_awarded"] == 15
        assert "total_xp" in data
