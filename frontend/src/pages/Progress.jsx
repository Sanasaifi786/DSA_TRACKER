import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Progress.css";

const DIFFICULTY_COLOR = {
    Easy:   "badge-easy",
    Medium: "badge-medium",
    Hard:   "badge-hard",
};

function Progress() {
    const { token } = useAuth();

    const [progress,   setProgress]   = useState([]);   // solved question records
    const [topicCount, setTopicCount] = useState({});   // { "Arrays": 3, ... }
    const [questions,  setQuestions]  = useState({});   // questionId → question details
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [progressRes, topicRes] = await Promise.all([
                    fetch("http://localhost:8000/api/v1/progress",            { headers }),
                    fetch("http://localhost:8000/api/v1/progress/topic-count",{ headers }),
                ]);

                const progressData = await progressRes.json();
                const topicData    = await topicRes.json();

                if (!progressRes.ok) throw new Error(progressData.message);

                setProgress(progressData.progress || []);
                setTopicCount(topicData.topicWise || {});

            } catch (err) {
                setError("Failed to load progress. Try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [token]);

    // ── Computed Stats ─────────────────────────────────────────────────────────
    const totalSolved = progress.length;

    const byDifficulty = progress.reduce((acc, p) => {
        const diff = p.difficulty || "Unknown";
        acc[diff]  = (acc[diff] || 0) + 1;
        return acc;
    }, {});

    const topicEntries = Object.entries(topicCount).sort((a, b) => b[1] - a[1]);

    // ── Render ─────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="progress-loading">
                <div className="loading-spinner" />
                <p>Loading your progress...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="progress-error">
                <span>⚠️</span><p>{error}</p>
            </div>
        );
    }

    return (
        <main className="progress-page">

            {/* ── Page Header ── */}
            <div className="progress-header">
                <h1 className="progress-title">My Progress</h1>
                <p className="progress-subtitle">
                    Here's a summary of everything you've solved so far
                </p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="summary-grid">
                <div className="summary-card summary-total">
                    <span className="summary-icon">🏆</span>
                    <span className="summary-number">{totalSolved}</span>
                    <span className="summary-label">Total Solved</span>
                </div>
                <div className="summary-card">
                    <span className="summary-icon">🟢</span>
                    <span className="summary-number">{byDifficulty.Easy || 0}</span>
                    <span className="summary-label">Easy</span>
                </div>
                <div className="summary-card">
                    <span className="summary-icon">🟡</span>
                    <span className="summary-number">{byDifficulty.Medium || 0}</span>
                    <span className="summary-label">Medium</span>
                </div>
                <div className="summary-card">
                    <span className="summary-icon">🔴</span>
                    <span className="summary-number">{byDifficulty.Hard || 0}</span>
                    <span className="summary-label">Hard</span>
                </div>
            </div>

            {totalSolved === 0 ? (
                /* ── Empty State ── */
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No questions solved yet</h3>
                    <p>Start solving questions and your progress will appear here.</p>
                    <Link to="/sheet/striver" className="empty-cta">
                        Start with Striver Sheet →
                    </Link>
                </div>
            ) : (
                <>
                    {/* ── Topic Breakdown ── */}
                    {topicEntries.length > 0 && (
                        <section className="topic-breakdown">
                            <h2 className="section-title">Topic Breakdown</h2>
                            <div className="topic-grid">
                                {topicEntries.map(([topic, count]) => (
                                    <div key={topic} className="topic-card">
                                        <div className="topic-card-top">
                                            <span className="topic-card-name">{topic}</span>
                                            <span className="topic-card-count">{count} solved</span>
                                        </div>
                                        <div className="topic-card-bar">
                                            <div
                                                className="topic-card-fill"
                                                style={{
                                                    width: `${Math.min((count / Math.max(...Object.values(topicCount))) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Solved Questions List ── */}
                    <section className="solved-section">
                        <h2 className="section-title">Solved Questions</h2>
                        <div className="solved-list">
                            {progress.map((p, i) => (
                                <div key={p._id || i} className="solved-row">
                                    <span className="solved-check">✓</span>
                                    <span className="solved-topic-tag">{p.topic}</span>
                                    <span className="solved-date">
                                        {p.solvedAt
                                            ? new Date(p.solvedAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric"
                                              })
                                            : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default Progress;
