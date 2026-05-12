import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const SHEETS = [
    {
        id: "striver",
        name: "Striver's SDE Sheet",
        description: "The most popular DSA sheet by Striver (takeUforward). Covers all core topics for product-based company interviews.",
        icon: "⚡",
        color: "#f59e0b",
        glow: "rgba(245,158,11,0.2)",
        topics: ["Arrays", "Strings", "Linked List", "Trees", "DP", "Graphs"],
        level: "Beginner → Advanced",
    },
    {
        id: "lovebabbar",
        name: "Love Babbar Sheet",
        description: "450 handpicked DSA questions by Love Babbar. Trusted by thousands of students for placement preparation.",
        icon: "🔥",
        color: "#fb923c",
        glow: "rgba(251,146,60,0.2)",
        topics: ["Arrays", "DP", "Graphs", "Trees", "Recursion", "Backtracking"],
        level: "Intermediate → Advanced",
    },
    {
        id: "daily",
        name: "Daily Challenge",
        description: "Solve one new problem every day. Stay consistent and build the habit that separates good developers from great ones.",
        icon: "📅",
        color: "#a8a29e",
        glow: "rgba(168,162,158,0.2)",
        topics: ["Mixed Topics", "All Difficulties", "Fresh Problems"],
        level: "All Levels",
    },
];

const FEATURES = [
    { icon: "📊", title: "Track Progress", desc: "Mark questions as solved and see your progress across all sheets in real time." },
    { icon: "🗂️", title: "Topic-wise View", desc: "Questions grouped by topic — Arrays, Trees, DP, Graphs and more." },
    { icon: "🎯", title: "Difficulty Filter", desc: "Filter by Easy, Medium or Hard to focus on what you need most." },
    { icon: "🔗", title: "Direct LeetCode Links", desc: "Each question links directly to LeetCode or GFG. No searching required." },
];

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [stats, setStats] = useState({ striver: 0, lovebabbar: 0, daily: 0 });

    useEffect(() => {
        // Fetch question counts for each sheet for stats display
        const fetchCounts = async () => {
            try {
                const [s, l, d] = await Promise.all([
                    fetch("http://localhost:8000/api/v1/questions?sheet=striver"),
                    fetch("http://localhost:8000/api/v1/questions?sheet=lovebabbar"),
                    fetch("http://localhost:8000/api/v1/questions?sheet=daily"),
                ]);
                const [sData, lData, dData] = await Promise.all([s.json(), l.json(), d.json()]);

                const count = (data) =>
                    Object.values(data).reduce((acc, arr) => acc + arr.length, 0);

                setStats({
                    striver: count(sData),
                    lovebabbar: count(lData),
                    daily: count(dData),
                });
            } catch {
                // Silently fail — stats just stay 0
            }
        };
        fetchCounts();
    }, []);

    const totalQuestions = stats.striver + stats.lovebabbar + stats.daily;

    return (
        <main className="home">

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-badge">🚀 Your DSA Journey Starts Here</div>
                <h1 className="hero-title">
                    Master DSA with<br />
                    <span className="gradient-text">SkillPath</span>
                </h1>
                <p className="hero-subtitle">
                    Track your progress across Striver, Love Babbar & Daily Challenge sheets.
                    Stay consistent. Land your dream job.
                </p>
                <div className="hero-actions">
                    {user ? (
                        <>
                            <Link to="/sheet/striver" className="btn-primary">Start Solving →</Link>
                            <Link to="/progress" className="btn-ghost">My Progress</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="btn-primary">Get Started Free →</Link>
                            <Link to="/signin" className="btn-ghost">Sign In</Link>
                        </>
                    )}
                </div>

                {/* Stats Row */}
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">{totalQuestions || "450"}+</span>
                        <span className="stat-label">Total Questions</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number">3</span>
                        <span className="stat-label">DSA Sheets</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number">10+</span>
                        <span className="stat-label">Topics Covered</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number">Free</span>
                        <span className="stat-label">Always</span>
                    </div>
                </div>
            </section>

            {/* ── Sheet Cards ── */}
            <section className="sheets-section">
                <h2 className="section-title">Choose Your Sheet</h2>
                <p className="section-subtitle">Pick the DSA sheet that matches your preparation goal</p>

                <div className="sheets-grid">
                    {SHEETS.map((sheet) => (
                        <div
                            key={sheet.id}
                            className="sheet-card"
                            style={{ "--card-color": sheet.color, "--card-glow": sheet.glow }}
                        >
                            <div className="sheet-icon">{sheet.icon}</div>
                            <h3 className="sheet-name">{sheet.name}</h3>
                            <p className="sheet-desc">{sheet.description}</p>

                            <div className="sheet-meta">
                                <span className="sheet-level">{sheet.level}</span>
                                <span className="sheet-count">
                                    {stats[sheet.id] || "—"} questions
                                </span>
                            </div>

                            <div className="sheet-topics">
                                {sheet.topics.map((t) => (
                                    <span key={t} className="topic-tag">{t}</span>
                                ))}
                            </div>

                            <Link to={`/sheet/${sheet.id}`} className="sheet-btn">
                                Start Sheet →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="features-section">
                <h2 className="section-title">Everything You Need</h2>
                <p className="section-subtitle">Built to make your DSA prep smarter and faster</p>
                <div className="features-grid">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="feature-card">
                            <span className="feature-icon">{f.icon}</span>
                            <h4 className="feature-title">{f.title}</h4>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            {!user && (
                <section className="cta-section">
                    <h2 className="cta-title">Ready to crack your interviews?</h2>
                    <p className="cta-subtitle">Join SkillPath and start tracking your DSA progress today. It's free.</p>
                    <Link to="/signup" className="btn-primary">Create Free Account →</Link>
                </section>
            )}

        </main>
    );
}

export default Home;