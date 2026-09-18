import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { api, ApiError } from "../services/api.js";
import "./FacultySelect.css";

export default function FacultySelect() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .getFacultyList()
      .then((data) => {
        if (!cancelled) setFaculty(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Could not load the faculty list. Please try again."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faculty;
    return faculty.filter(
      (f) =>
        f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q)
    );
  }, [faculty, query]);

  return (
    <div className="screen select-screen">
      <Header />

      <main className="select-screen__content">
        <p className="eyebrow">&#10022; FACULTY CHECK-IN &#10022;</p>
        <h1 className="section-heading">
          Please select
          <br />
          <span className="accent">Your Name</span>
        </h1>
        <p className="body-copy body-copy--tight">Please select your name to continue.</p>

        <div className="search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your name..."
            aria-label="Search your name"
          />
        </div>

        {loading && <p className="status-text">Loading faculty list…</p>}
        {error && <p className="status-text status-text--error">{error}</p>}

        {!loading && !error && (
          <ul className="faculty-list">
            {filtered.length === 0 && (
              <li className="status-text">No matching names. Try a different search.</li>
            )}
            {filtered.map((f) => (
              <li key={f.id}>
                <button
                  className="faculty-card"
                  onClick={() => navigate(`/signature/${f.id}`)}
                >
                  <span className="faculty-card__info">
                    <span className="faculty-card__name">{f.name}</span>
                    <span className="faculty-card__dept">{f.department}</span>
                  </span>
                  <span className="faculty-card__arrow" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
