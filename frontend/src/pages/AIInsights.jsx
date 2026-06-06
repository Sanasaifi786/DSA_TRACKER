import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AIInsights.css";

const DIFFICULTY_COLOR = {
    Easy:   "badge-easy",
    Medium: "badge-medium",
    Hard:   "badge-hard",
};

function AIInsights() {
    const { token } = useAuth();

    const [plan,    setPlan]    = useState(null);
    const [recs,    setRecs]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");

    useEffect(() => {
        const fetchAI = async () => {
            setLoading(true);
            setError("");
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [planRes, recsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/ai/weak-topics`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/ai/recommend`,   { headers }),
                ]);

                const planData = await planRes.json();
                const recsData = await recsRes.json();

                if (!planRes.ok) throw new Error(planData.message);

                setPlan(planData);
                setRecs(recsData.recommendations || []);

            } catch (err) {
                setError(err.message || "AI analysis failed. Try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchAI();
    }, [token]);

    if (loading) {
        return (
            <div className="ai-loading">
                <div className="ai-spinner" />
                <p className="ai-loading-text">🤖 Gemini is analysing your progress...</p>
                <span className="ai-loading-sub">This may take a few seconds</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ai-error">
                <span>⚠️</span>
                <p>{error}</p>
                <p className="ai-error-hint">
                    Make sure you have solved at least a few questions first!
                </p>
            </div>
        );
    }

    return (
        <main className="ai-page">

            {/* ── Header ── */}
            <div className="ai-header">
                <div className="ai-header-badge">🤖 Powered by Google Gemini</div>
                <h1 className="ai-title">AI Study Insights</h1>
                <p className="ai-subtitle">
                    Personalised analysis of your weak areas and today's recommended questions
                </p>
            </div>

            {/* ── Study Plan Card ── */}
            <section className="ai-section">
                <h2 className="ai-section-title">📋 Your Study Plan</h2>
                <div className="study-plan-card">
                    <p className="study-plan-text">
                        {plan?.studyPlan || plan?.message || "Keep going! Your plan is being built."}
                    </p>
                </div>
            </section>

            {/* ── Weak / Abandoned / Active topics ── */}
            {(plan?.weakTopics?.length > 0 || plan?.abandonedTopics?.length > 0 || plan?.activeTopics?.length > 0) && (
                <section className="ai-section">
                    <h2 className="ai-section-title">📊 Topic Analysis</h2>
                    <div className="topic-analysis-grid">

                        {plan?.weakTopics?.length > 0 && (
                            <div className="topic-analysis-card weak">
                                <div className="tac-header">
                                    <span className="tac-icon">⚠️</span>
                                    <span className="tac-label">Weak Topics</span>
                                </div>
                                <ul className="tac-list">
                                    {plan.weakTopics.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {plan?.abandonedTopics?.length > 0 && (
                            <div className="topic-analysis-card abandoned">
                                <div className="tac-header">
                                    <span className="tac-icon">💤</span>
                                    <span className="tac-label">Abandoned Topics</span>
                                </div>
                                <ul className="tac-list">
                                    {plan.abandonedTopics.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {plan?.activeTopics?.length > 0 && (
                            <div className="topic-analysis-card active">
                                <div className="tac-header">
                                    <span className="tac-icon">🔥</span>
                                    <span className="tac-label">Active Topics</span>
                                </div>
                                <ul className="tac-list">
                                    {plan.activeTopics.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </section>
            )}

            {/* ── Recommended Questions ── */}
            <section className="ai-section">
                <h2 className="ai-section-title">🎯 Today's Recommended Questions</h2>
                {recs.length === 0 ? (
                    <div className="ai-empty">
                        <p>No recommendations yet. Solve more questions to get personalised picks!</p>
                        <Link to="/sheet/striver" className="ai-empty-cta">
                            Go to Striver Sheet →
                        </Link>
                    </div>
                ) : (
                    <div className="recs-list">
                        {recs.map((r, i) => (
                            <div key={r.questionId || i} className="rec-card">
                                <div className="rec-top">
                                    <span className="rec-num">{i + 1}</span>
                                    <span className="rec-title">{r.title}</span>
                                    <span className={`q-badge ${DIFFICULTY_COLOR[r.difficulty]}`}>
                                        {r.difficulty}
                                    </span>
                                    {r.link && (
                                        <a
                                            href={r.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rec-link"
                                            title="Open on LeetCode"
                                        >
                                            ↗
                                        </a>
                                    )}
                                </div>
                                <div className="rec-reason">
                                    <span className="rec-reason-icon">💡</span>
                                    <span>{r.reason}</span>
                                </div>
                                <div className="rec-topic">{r.topic}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}

export default AIInsights;
