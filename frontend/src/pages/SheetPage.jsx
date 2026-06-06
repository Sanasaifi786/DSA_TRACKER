import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import "./SheetPage.css";

const SHEET_NAMES = {
    striver:    "Striver's SDE Sheet",
    lovebabbar: "Love Babbar 450",
    daily:      "Daily Challenge",
};

const DIFFICULTY_COLOR = {
    Easy:   "badge-easy",
    Medium: "badge-medium",
    Hard:   "badge-hard",
};

function SheetPage() {
    const { sheet } = useParams(); // "striver" | "lovebabbar" | "daily"

    const [groupedQuestions, setGroupedQuestions] = useState({});  // { "Arrays": [...], ... }
    const [solvedIds, setSolvedIds]               = useState(new Set()); // Set of solved questionIds
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [loading, setLoading]                   = useState(true);
    const [toggling, setToggling]                 = useState(null); // questionId being toggled
    const [error, setError]                       = useState("");

    const token     = localStorage.getItem("accessToken");
    const isLoggedIn = !!token;

    // ── Fetch Questions ────────────────────────────────────────────────────────
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res  = await fetch(`http://localhost:8000/api/v1/questions?sheet=${sheet}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setGroupedQuestions(data); // { "Arrays": [...], ... }
        } catch (err) {
            setError("Failed to load questions. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    }, [sheet]);

    // ── Fetch User Progress ────────────────────────────────────────────────────
    const fetchProgress = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const res  = await fetch("http://localhost:8000/api/v1/progress", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) return;
            // Build a Set of solved questionIds
            const solved = new Set(
                data.progress
                    .filter(p => p.isDone)
                    .map(p => p.question)
            );
            setSolvedIds(solved);
        } catch {
            // Silently fail — progress just won't show
        }
    }, [isLoggedIn, token]);

    useEffect(() => {
        fetchQuestions();
        fetchProgress();
    }, [fetchQuestions, fetchProgress]);

    // ── Toggle Solved ──────────────────────────────────────────────────────────
    const handleToggle = async (questionId) => {
        if (!isLoggedIn) {
            alert("Please sign in to track your progress.");
            return;
        }
        setToggling(questionId);
        try {
            const res  = await fetch(`http://localhost:8000/api/v1/progress/toggle/${questionId}`, {
                method:  "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSolvedIds(prev => {
                const next = new Set(prev);
                if (data.isDone) next.add(questionId);
                else             next.delete(questionId);
                return next;
            });
        } catch {
            alert("Failed to update progress. Try again.");
        } finally {
            setToggling(null);
        }
    };

    // ── Computed Stats ─────────────────────────────────────────────────────────
    const allQuestions   = Object.values(groupedQuestions).flat();
    const totalCount     = allQuestions.length;
    const solvedCount    = allQuestions.filter(q => solvedIds.has(q._id)).length;
    const progressPct    = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0;

    // ── Filter Questions ───────────────────────────────────────────────────────
    const getFilteredTopics = () => {
        return Object.entries(groupedQuestions).map(([topic, questions]) => {
            const filtered = difficultyFilter === "All"
                ? questions
                : questions.filter(q => q.difficulty === difficultyFilter);
            return [topic, filtered];
        }).filter(([, questions]) => questions.length > 0);
    };

    const filteredTopics = getFilteredTopics();

    // ── Render ─────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="sheet-loading">
                <div className="loading-spinner" />
                <p>Loading questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sheet-error">
                <span>⚠️</span>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="sheet-page">

            {/* ── Header ── */}
            <div className="sheet-header">
                <div className="sheet-header-top">
                    <div>
                        <h1 className="sheet-title">{SHEET_NAMES[sheet] || sheet}</h1>
                        <p className="sheet-subtitle">
                            {solvedCount} / {totalCount} questions solved
                        </p>
                    </div>
                    {!isLoggedIn && (
                        <Link to="/signin" className="signin-prompt">
                            🔒 Sign in to track progress
                        </Link>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="sheet-progress-bar">
                    <div
                        className="sheet-progress-fill"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <span className="sheet-progress-pct">{progressPct}% complete</span>
            </div>

            {/* ── Difficulty Filter ── */}
            <div className="difficulty-filter">
                {["All", "Easy", "Medium", "Hard"].map(d => (
                    <button
                        key={d}
                        className={`filter-btn ${difficultyFilter === d ? "active" : ""} filter-${d.toLowerCase()}`}
                        onClick={() => setDifficultyFilter(d)}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* ── Topic Sections ── */}
            <div className="topics-container">
                {filteredTopics.map(([topic, questions]) => {
                    const topicSolved = questions.filter(q => solvedIds.has(q._id)).length;
                    const topicPct    = Math.round((topicSolved / questions.length) * 100);

                    return (
                        <TopicSection
                            key={topic}
                            topic={topic}
                            questions={questions}
                            solvedIds={solvedIds}
                            toggling={toggling}
                            topicSolved={topicSolved}
                            topicPct={topicPct}
                            onToggle={handleToggle}
                        />
                    );
                })}

                {filteredTopics.length === 0 && (
                    <div className="no-results">
                        No {difficultyFilter} questions found in this sheet.
                    </div>
                )}
            </div>
        </main>
    );
}

// ── Topic Section Component ────────────────────────────────────────────────────
function TopicSection({ topic, questions, solvedIds, toggling, topicSolved, topicPct, onToggle }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="topic-section">
            {/* Topic Header */}
            <button className="topic-header" onClick={() => setOpen(o => !o)}>
                <div className="topic-header-left">
                    <span className="topic-chevron">{open ? "▾" : "▸"}</span>
                    <span className="topic-name">{topic}</span>
                    <span className="topic-count">{topicSolved}/{questions.length}</span>
                </div>
                <div className="topic-progress-wrap">
                    <div className="topic-mini-bar">
                        <div
                            className="topic-mini-fill"
                            style={{ width: `${topicPct}%` }}
                        />
                    </div>
                    <span className="topic-pct">{topicPct}%</span>
                </div>
            </button>

            {/* Questions List */}
            {open && (
                <div className="questions-list">
                    {questions.map(q => {
                        const isSolved   = solvedIds.has(q._id);
                        const isToggling = toggling === q._id;

                        return (
                            <div
                                key={q._id}
                                className={`question-row ${isSolved ? "solved" : ""}`}
                            >
                                {/* Checkbox */}
                                <button
                                    className={`q-checkbox ${isSolved ? "checked" : ""} ${isToggling ? "loading" : ""}`}
                                    onClick={() => onToggle(q._id)}
                                    disabled={isToggling}
                                    aria-label={isSolved ? "Mark unsolved" : "Mark solved"}
                                >
                                    {isToggling ? "…" : isSolved ? "✓" : ""}
                                </button>

                                {/* Title */}
                                <span className={`q-title ${isSolved ? "q-title-solved" : ""}`}>
                                    {q.title}
                                </span>

                                {/* Difficulty Badge */}
                                <span className={`q-badge ${DIFFICULTY_COLOR[q.difficulty]}`}>
                                    {q.difficulty}
                                </span>

                                {/* LeetCode Link */}
                                {q.link && (
                                    <a
                                        href={q.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="q-link"
                                        title="Open on LeetCode"
                                    >
                                        ↗
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SheetPage;
