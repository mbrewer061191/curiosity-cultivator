'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useActivities } from '../hooks/useActivities';

const TYPE_ICONS = { explorer: '🌿', artist: '🎨', detective: '🔎', mapmaker: '🗺️' };
const TYPE_LABELS = { explorer: 'Explorer', artist: 'Artist', detective: 'Detective', mapmaker: 'Mapmaker' };
const ENERGY_MAP = { Amp: '⚡ Amp It Up', Calm: '🧘 Calm It Down', Neutral: '➖ Neutral' };

export default function LibraryPage() {
    const { activities, deleteActivity, loaded } = useActivities();
    const [activeFilters, setActiveFilters] = useState([]);
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'rating' | 'title'
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const toggleFilter = (type) => {
        setActiveFilters(f =>
            f.includes(type) ? f.filter(x => x !== type) : [...f, type]
        );
    };

    const filtered = activities
        .filter(a => {
            if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (activeFilters.length === 0) return true;
            return activeFilters.every(t => a[t]);
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0; // default: most recent first (already stored newest-first)
        });

    if (!loaded) return null;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1>📚 Activity Library</h1>
                <p>{activities.length} saved activit{activities.length === 1 ? 'y' : 'ies'}</p>
            </div>

            {activities.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📚</span>
                    <h3>Your library is empty</h3>
                    <p>Add your first activity to get started building your curiosity collection!</p>
                    <Link href="/add" className="btn btn-primary" style={{ marginTop: 20 }}>➕ Add First Activity</Link>
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div style={{ marginBottom: 16 }}>
                        <input
                            className="form-input"
                            placeholder="🔍 Search activities..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            id="search-activities"
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by type:</span>
                        {['explorer', 'artist', 'detective', 'mapmaker'].map(type => (
                            <button
                                key={type}
                                className={`filter-btn ${activeFilters.includes(type) ? `active-${type}` : ''}`}
                                onClick={() => toggleFilter(type)}
                                id={`filter-${type}`}
                            >
                                {TYPE_ICONS[type]} {TYPE_LABELS[type]}
                            </button>
                        ))}
                        {activeFilters.length > 0 && (
                            <button className="filter-btn" onClick={() => setActiveFilters([])}>✕ Clear</button>
                        )}

                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: 'auto' }}>Sort:</span>
                        <select
                            className="form-select"
                            style={{ width: 'auto', padding: '6px 12px' }}
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            id="sort-activities"
                        >
                            <option value="date">Newest First</option>
                            <option value="rating">Highest Rated</option>
                            <option value="title">A–Z</option>
                        </select>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state" style={{ paddingTop: 40 }}>
                            <span className="empty-icon">🔍</span>
                            <h3>No matches found</h3>
                            <p>Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="library-grid">
                            {filtered.map(activity => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onDelete={() => setConfirmDelete(activity.id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Delete confirm modal */}
            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal pop-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🗑️ Delete Activity?</h3>
                            <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            This will permanently remove the activity from your library. This can't be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-danger" onClick={() => { deleteActivity(confirmDelete); setConfirmDelete(null); }}>
                                Yes, Delete
                            </button>
                            <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActivityCard({ activity, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    const types = ['explorer', 'artist', 'detective', 'mapmaker'].filter(t => activity[t]);
    const stars = activity.rating || 0;

    return (
        <div className="activity-card" onClick={() => setExpanded(!expanded)}>
            <div className="activity-card-header">
                <div style={{ flex: 1 }}>
                    <div className="activity-card-title">{activity.title}</div>
                    <div className="activity-card-date">{activity.dateAdded}</div>
                </div>
                <div>
                    <div className="star-rating" style={{ justifyContent: 'flex-end' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`star ${s <= stars ? 'filled' : ''}`} style={{ fontSize: '1rem', cursor: 'default' }}>★</span>
                        ))}
                    </div>
                    {activity.fileName && activity.fileName !== 'No file attached' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>📎 {activity.fileName}</div>
                    )}
                </div>
            </div>

            <div className="activity-card-meta">
                {types.map(t => (
                    <span key={t} className={`badge badge-${t}`}>{TYPE_ICONS[t]} {TYPE_LABELS[t]}</span>
                ))}
                {activity.energyLevel && activity.energyLevel !== 'Neutral' && (
                    <span className={`badge badge-${activity.energyLevel === 'Amp' ? 'amp' : 'calm'}`}>
                        {ENERGY_MAP[activity.energyLevel]}
                    </span>
                )}
            </div>

            {expanded && activity.notes && (
                <div className="activity-card-notes">
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Reflection Notes
                    </strong>
                    <p style={{ marginTop: 6 }}>{activity.notes}</p>
                </div>
            )}

            <div className="activity-actions" onClick={e => e.stopPropagation()}>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? '▲ Less' : '▼ Notes'}
                </button>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={onDelete}
                    id={`delete-${activity.id}`}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
}
