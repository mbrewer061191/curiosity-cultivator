'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActivities } from '../hooks/useActivities';
import StarRating from '../components/StarRating';

const CURIOSITY_TYPES = [
    { key: 'explorer', label: '🌿 Explorer', desc: 'Joyous Discovery: Sensory, wonder-based', colorClass: '' },
    { key: 'artist', label: '🎨 Artist', desc: 'Creative Curiosity: Imagination, play', colorClass: 'artist' },
    { key: 'detective', label: '🔎 Detective', desc: 'Deprivation Curiosity: Problem-solving', colorClass: 'detective' },
    { key: 'mapmaker', label: '🗺️ Mapmaker', desc: 'Epistemic Curiosity: Organizing, systems', colorClass: 'mapmaker' },
];

const MOVEMENT_TYPES = [
    { key: 'grossMotor', label: '🏃 Gross Motor', desc: 'Large muscle movement: running, jumping, climbing', colorClass: 'gross' },
    { key: 'fineMotor', label: '✂️ Fine Motor', desc: 'Small muscle control: cutting, drawing, threading', colorClass: 'fine' },
    { key: 'outdoor', label: '🌳 Outdoor', desc: 'Takes place or works best outside', colorClass: 'outdoor' },
];

const ENERGY_OPTIONS = [
    { value: 'Amp', label: '⚡ Amp It Up', desc: 'Jumping, heavy work, big movement', selClass: 'selected-amp' },
    { value: 'Calm', label: '🧘 Calm It Down', desc: 'Deep breathing, quiet spaces, sensory', selClass: 'selected-calm' },
    { value: 'Neutral', label: '➖ Neutral / N/A', desc: 'No specific regulation focus', selClass: 'selected-neutral' },
];

export default function AddPage() {
    const router = useRouter();
    const { addActivity } = useActivities();
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        notes: '',
        explorer: false,
        artist: false,
        detective: false,
        mapmaker: false,
        grossMotor: false,
        fineMotor: false,
        outdoor: false,
        energyLevel: '',
        rating: 0,
        fileName: '',
    });

    const [dragOver, setDragOver] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [tip, setTip] = useState('');

    const toggle = (key) => setForm(f => ({ ...f, [key]: !f[key] }));

    const handleFile = (file) => {
        if (file) setForm(f => ({ ...f, fileName: file.name }));
    };

    const typesSelected = ['explorer', 'artist', 'detective', 'mapmaker'].filter(t => form[t]).length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Please enter an activity title.'); return; }
        setError('');

        const newActivity = {
            ...form,
            title: form.title.trim(),
            dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        };

        await addActivity(newActivity);
        setSubmitted(true);

        if (typesSelected < 2) {
            setTip('💡 80/20 Rule Tip: Try to include at least 2 curiosity types in each activity for richer learning!');
        }
    };

    const handleReset = () => {
        setForm({ title: '', notes: '', explorer: false, artist: false, detective: false, mapmaker: false, grossMotor: false, fineMotor: false, outdoor: false, energyLevel: '', rating: 0, fileName: '' });
        setSubmitted(false);
        setTip('');
        setError('');
    };

    if (submitted) {
        return (
            <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Activity Saved!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{form.title}</strong> has been added to your library.
                </p>
                {tip && (
                    <div className="alert alert-warning" style={{ textAlign: 'left', marginBottom: 24 }}>
                        <span>💡</span>
                        <span>{tip}</span>
                    </div>
                )}
                {!tip && (
                    <div className="alert alert-success" style={{ textAlign: 'left', marginBottom: 24, justifyContent: 'center' }}>
                        ✅ Great job including {typesSelected} curiosity types — you're hitting the 80/20 rule!
                    </div>
                )}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={handleReset}>➕ Add Another</button>
                    <button className="btn btn-secondary" onClick={() => router.push('/library')}>📚 View Library</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ maxWidth: 720 }}>
            <div className="page-header">
                <h1>➕ Add New Activity</h1>
                <p>Tag and rate your lesson plans based on curiosity types from the ECE training.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="form-group">
                        <label className="form-label">Activity Title *</label>
                        <input
                            className="form-input"
                            placeholder="e.g., Nature Sensory Bin"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            id="activity-title"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Upload Attachment (optional)</label>
                        {form.fileName ? (
                            <div className="file-attached">
                                <span>📎</span>
                                <span style={{ flex: 1 }}>{form.fileName}</span>
                                <button type="button" className="btn btn-sm btn-danger" onClick={() => setForm(f => ({ ...f, fileName: '' }))}>Remove</button>
                            </div>
                        ) : (
                            <div
                                className={`file-upload-zone ${dragOver ? 'drag-over' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                            >
                                <input
                                    type="file"
                                    ref={fileRef}
                                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                                    onChange={e => handleFile(e.target.files[0])}
                                    id="file-upload"
                                />
                                <span className="file-upload-icon">📁</span>
                                <p className="file-upload-text">
                                    <strong>Click to upload</strong> or drag & drop<br />
                                    PDF, Image, or Word Doc
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Curiosity Types */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <p className="section-title">1. 🧠 Curiosity Types Supported</p>
                    <p className="section-caption">Select all types this activity supports — one activity can have all 4!</p>
                    <div className="checkbox-grid">
                        {CURIOSITY_TYPES.map(type => (
                            <label
                                key={type.key}
                                className={`checkbox-card ${form[type.key] ? `checked ${type.colorClass}` : ''}`}
                                htmlFor={`type-${type.key}`}
                            >
                                <input
                                    type="checkbox"
                                    id={`type-${type.key}`}
                                    checked={form[type.key]}
                                    onChange={() => toggle(type.key)}
                                />
                                <div className="checkbox-content">
                                    <strong>{type.label}</strong>
                                    <small>{type.desc}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                    {typesSelected > 0 && (
                        <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {typesSelected} type{typesSelected > 1 ? 's' : ''} selected
                            {typesSelected >= 2 ? ' ✅ Great — hitting the 80/20 rule!' : ' — try adding one more for richer learning!'}
                        </div>
                    )}
                </div>

                {/* Movement / Setting Types */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <p className="section-title">2. 🏃 Movement & Setting</p>
                    <p className="section-caption">Select all that apply — activities can include multiple!</p>
                    <div className="checkbox-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        {MOVEMENT_TYPES.map(type => (
                            <label
                                key={type.key}
                                className={`checkbox-card ${form[type.key] ? `checked ${type.colorClass}` : ''}`}
                                htmlFor={`type-${type.key}`}
                            >
                                <input
                                    type="checkbox"
                                    id={`type-${type.key}`}
                                    checked={form[type.key]}
                                    onChange={() => toggle(type.key)}
                                />
                                <div className="checkbox-content">
                                    <strong>{type.label}</strong>
                                    <small>{type.desc}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Energy Level */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <p className="section-title">3. ⚡ Regulation Station (Energy Level)</p>
                    <p className="section-caption">Does this activity amp kids up or calm them down?</p>
                    <div className="radio-group">
                        {ENERGY_OPTIONS.map(opt => (
                            <label
                                key={opt.value}
                                className={`radio-card ${form.energyLevel === opt.value ? opt.selClass : ''}`}
                                htmlFor={`energy-${opt.value}`}
                            >
                                <input
                                    type="radio"
                                    id={`energy-${opt.value}`}
                                    name="energyLevel"
                                    checked={form.energyLevel === opt.value}
                                    onChange={() => setForm(f => ({ ...f, energyLevel: opt.value }))}
                                />
                                <div>
                                    <span style={{ fontWeight: 600 }}>{opt.label}</span>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <p className="section-title">4. ⭐ How Did It Go?</p>
                    <p className="section-caption">Rate this activity after you've tried it with the kids.</p>
                    <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                </div>

                {/* Notes */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <p className="section-title">5. 📝 Reflection Notes</p>
                    <p className="section-caption">e.g., Which curiosity type did you support most? What worked?</p>
                    <textarea
                        className="form-textarea"
                        placeholder="The kids loved the sensory bin — mostly Explorer curiosity. Next time I'd add sorting trays for Mapmaker..."
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        id="reflection-notes"
                    />
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 16 }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" id="save-activity" style={{ width: '100%', padding: '15px' }}>
                    💾 Save to Library
                </button>
            </form>
        </div>
    );
}
