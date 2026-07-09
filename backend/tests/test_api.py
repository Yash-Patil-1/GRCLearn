import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

class TestHealth:
    def test_root(self, client): assert client.get("/").status_code == 200
    def test_health(self, client): assert client.get("/health").json()["status"] == "healthy"

class TestControls:
    def test_list(self, client):
        r = client.get("/api/controls")
        assert r.status_code == 200 and r.json()["total"] > 10
    def test_search(self, client):
        r = client.get("/api/controls/search?q=access")
        assert r.status_code == 200 and r.json()["total"] >= 3
    def test_get(self, client):
        r = client.get("/api/controls/nist-ac-2")
        assert r.status_code == 200 and r.json()["name"] == "Account Management"
    def test_404(self, client):
        assert client.get("/api/controls/nonexistent").status_code == 404
    def test_families(self, client):
        r = client.get("/api/controls/families")
        assert r.status_code == 200 and len(r.json()["families"]) > 3

class TestFrameworks:
    def test_list(self, client):
        r = client.get("/api/frameworks")
        assert r.status_code == 200 and len(r.json()["frameworks"]) >= 1

class TestRisks:
    def test_list(self, client):
        r = client.get("/api/risks")
        assert r.status_code == 200 and r.json()["total"] >= 8
    def test_register_add(self, client):
        r = client.post("/api/risks/register", json={"name": "Test Risk", "likelihood": 3, "impact": 4, "treatment": "mitigate"})
        assert r.status_code == 200 and r.json()["risk_level"] == "High"

class TestPolicies:
    def test_list(self, client):
        r = client.get("/api/policies")
        assert r.status_code == 200 and len(r.json()["policies"]) >= 2
    def test_get(self, client):
        r = client.get("/api/policies/access_control")
        assert r.status_code == 200 and "Access Control" in r.json()["content"]

class TestAudit:
    def test_checklist(self, client):
        r = client.get("/api/audit/checklist?framework=NIST 800-53")
        assert r.status_code == 200 and r.json()["total"] > 5

class TestProgress:
    def test_get(self, client):
        r = client.get("/api/progress")
        assert r.status_code == 200 and "total" in r.json()
    def test_mark(self, client):
        r = client.post("/api/progress/mark", json={"item_id": "nist-ac-2"})
        assert r.status_code == 200
