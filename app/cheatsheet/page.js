'use client';

const PHRASES = [
    { old: "That's not how it works.", next: "That's interesting — tell me more!" },
    { old: "We don't have time for that.", next: "Let's save that question for later." },
    { old: "Because I said so.", next: "What do you think? Why might that be?" },
    { old: "Stop asking so many questions.", next: "I love how curious you are!" },
    { old: "That's wrong.", next: "Interesting idea — let's test it together." },
    { old: "Don't touch that.", next: "Let's explore that carefully together." },
    { old: "You already know this.", next: "What else are you wondering about?" },
    { old: "That's too hard for you.", next: "Let's break it into smaller pieces." },
];

const CURIOSITY_TYPES = [
    {
        icon: '🌿',
        name: 'Explorer',
        color: 'var(--green)',
        bg: 'var(--green-soft)',
        border: 'rgba(74,222,128,0.3)',
        desc: 'Joyous Discovery Curiosity',
        what: 'Sensory experiences, wonder-based exploration, hands-on discovery',
        examples: ['Nature walks & collections', 'Sensory bins (sand, water, slime)', 'Mystery bag guessing games'],
    },
    {
        icon: '🎨',
        name: 'Artist',
        color: 'var(--amber)',
        bg: 'var(--amber-soft)',
        border: 'rgba(251,191,36,0.3)',
        desc: 'Creative Curiosity',
        what: 'Imagination, open-ended play, creative expression',
        examples: ['Pretend play stations', 'Open-ended art (no instructions)', 'Storytelling & puppets'],
    },
    {
        icon: '🔎',
        name: 'Detective',
        color: 'var(--teal)',
        bg: 'var(--teal-soft)',
        border: 'rgba(45,212,191,0.3)',
        desc: 'Deprivation (Problem-Solving) Curiosity',
        what: 'Puzzles, mysteries, finding the "missing piece"',
        examples: ['What\'s inside? guessing activities', 'Simple science experiments', 'Matching & sorting challenges'],
    },
    {
        icon: '🗺️',
        name: 'Mapmaker',
        color: 'var(--violet)',
        bg: 'var(--violet-soft)',
        border: 'rgba(167,139,250,0.3)',
        desc: 'Epistemic (Systems) Curiosity',
        what: 'Organizing, categorizing, understanding how things fit together',
        examples: ['Graphing & charting activities', 'Making maps or timelines', 'Sorting & categorizing collections'],
    },
];

export default function CheatSheetPage() {
    return (
        <div className="fade-in">
            <div className="page-header">
                <h1>💡 Quick Reference Cheat Sheet</h1>
                <p>Pulled from your ECE Training handouts — for quick reference mid-class!</p>
            </div>

            {/* Curiosity Language */}
            <section style={{ marginBottom: 40 }}>
                <div className="section-title" style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                    🗣️ Curiosity-Friendly Language
                </div>
                <div className="cheat-card">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '0 12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--rose)', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                            Instead of saying...
                        </div>
                        <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                            Try saying...
                        </div>
                        {PHRASES.map((p, i) => (
                            <>
                                <div key={`old-${i}`} className="phrase-old" style={{ padding: '10px 0', borderBottom: i < PHRASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    "{p.old}"
                                </div>
                                <div key={`arrow-${i}`} className="phrase-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: i < PHRASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    →
                                </div>
                                <div key={`new-${i}`} className="phrase-new" style={{ padding: '10px 0', borderBottom: i < PHRASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    "{p.next}"
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4 Curiosity Types Reference */}
            <section style={{ marginBottom: 40 }}>
                <div className="section-title" style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                    🧠 The 4 Curiosity Types — At a Glance
                </div>
                <div className="card-grid">
                    {CURIOSITY_TYPES.map(type => (
                        <div
                            key={type.name}
                            className="card"
                            style={{ borderColor: type.border, backgroundColor: type.bg }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{type.icon}</div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: type.color, marginBottom: 4 }}>
                                {type.name}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{type.desc}</p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{type.what}</p>
                            <div>
                                {type.examples.map(ex => (
                                    <div key={ex} style={{
                                        fontSize: '0.82rem',
                                        color: type.color,
                                        padding: '4px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}>
                                        <span style={{ opacity: 0.6 }}>•</span> {ex}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 80/20 Rule Reminder */}
            <section style={{ marginBottom: 40 }}>
                <div className="section-title" style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                    📊 The 80/20 Rule
                </div>
                <div className="card" style={{ borderColor: 'rgba(74,222,128,0.3)', background: 'var(--green-soft)' }}>
                    <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
                        🎯 Aim for activities that hit at least 2 curiosity types.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Research shows that 80% of the richest learning happens when children experience <strong>multiple types of curiosity</strong> in a single activity.
                        When you notice only one type, ask: <em>"What could I add to spark a different kind of curiosity?"</em>
                    </p>
                </div>
            </section>

            {/* Regulation Station */}
            <section>
                <div className="section-title" style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                    ⚡ Regulation Station Quick Guide
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="card" style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'var(--amber-soft)' }}>
                        <h3 style={{ color: 'var(--amber)', marginBottom: 12, fontSize: '1rem' }}>⚡ Amp It Up Activities</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                            Use when kids seem sluggish or disengaged.
                        </p>
                        {['Jumping & hopping games', 'Heavy work (carrying, pushing)', 'Big movement dances', 'Outdoor running activities'].map(a => (
                            <div key={a} style={{ fontSize: '0.82rem', color: 'var(--amber)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                • {a}
                            </div>
                        ))}
                    </div>
                    <div className="card" style={{ borderColor: 'rgba(45,212,191,0.3)', background: 'var(--teal-soft)' }}>
                        <h3 style={{ color: 'var(--teal)', marginBottom: 12, fontSize: '1rem' }}>🧘 Calm It Down Activities</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                            Use when the room is overstimulated or chaotic.
                        </p>
                        {['Deep breathing exercises', 'Quiet sensory exploration', 'Calming music & movement', 'Cozy corner quiet time'].map(a => (
                            <div key={a} style={{ fontSize: '0.82rem', color: 'var(--teal)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                • {a}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
