'use client';
import Link from 'next/link';
import { useActivities } from './hooks/useActivities';

export default function Home() {
  const { activities, loaded } = useActivities();

  const total = activities.length;
  const explorers = activities.filter(a => a.explorer).length;
  const artists = activities.filter(a => a.artist).length;
  const detectives = activities.filter(a => a.detective).length;
  const mapmakers = activities.filter(a => a.mapmaker).length;
  const avgRating = total > 0
    ? (activities.reduce((s, a) => s + (a.rating || 0), 0) / total).toFixed(1)
    : '—';

  const recent = activities.slice(0, 3);

  if (!loaded) return null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🌱 Good to see you!</h1>
        <p>Your Curiosity Cultivator dashboard — track, rate, and grow amazing activities.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <span className="stat-value" style={{ color: 'var(--green)' }}>{total}</span>
          <span className="stat-label">Total Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌿</span>
          <span className="stat-value" style={{ color: 'var(--green)' }}>{explorers}</span>
          <span className="stat-label">Explorer Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎨</span>
          <span className="stat-value" style={{ color: 'var(--amber)' }}>{artists}</span>
          <span className="stat-label">Artist Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔎</span>
          <span className="stat-value" style={{ color: 'var(--teal)' }}>{detectives}</span>
          <span className="stat-label">Detective Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🗺️</span>
          <span className="stat-value" style={{ color: 'var(--violet)' }}>{mapmakers}</span>
          <span className="stat-label">Mapmaker Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-value" style={{ color: 'var(--amber)' }}>{avgRating}</span>
          <span className="stat-label">Avg. Rating</span>
        </div>
      </div>

      {total === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
          <h2 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>No activities yet!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Add your first activity and start building your Curiosity Library.
          </p>
          <Link href="/add" className="btn btn-primary">➕ Add Your First Activity</Link>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Recent Activities
          </h2>
          <div className="library-grid">
            {recent.map(a => (
              <RecentCard key={a.id} activity={a} />
            ))}
          </div>
          <div style={{ marginTop: '20px' }}>
            <Link href="/library" className="btn btn-secondary">View All Activities →</Link>
          </div>
        </>
      )}
    </div>
  );
}

function RecentCard({ activity }) {
  const types = ['explorer', 'artist', 'detective', 'mapmaker'].filter(t => activity[t]);
  const typeIcons = { explorer: '🌿', artist: '🎨', detective: '🔎', mapmaker: '🗺️' };
  const stars = activity.rating || 0;

  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <div>
          <div className="activity-card-title">{activity.title}</div>
          <div className="activity-card-date">{activity.dateAdded}</div>
        </div>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`star ${s <= stars ? 'filled' : ''}`} style={{ fontSize: '1rem', cursor: 'default' }}>★</span>
          ))}
        </div>
      </div>
      <div className="activity-card-meta">
        {types.map(t => (
          <span key={t} className={`badge badge-${t}`}>{typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</span>
        ))}
        {activity.energyLevel && activity.energyLevel !== 'Neutral' && (
          <span className={`badge badge-${activity.energyLevel === 'Amp' ? 'amp' : 'calm'}`}>
            {activity.energyLevel === 'Amp' ? '⚡ Amp It Up' : '🧘 Calm It Down'}
          </span>
        )}
      </div>
    </div>
  );
}
