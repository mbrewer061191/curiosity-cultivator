'use client';
import { useState } from 'react';

const STAR_LABELS = ['', 'Just Starting 🌱', 'Getting There 🌿', 'Pretty Good! 🌟', 'Really Great! ⭐', 'Amazing! 🏆'];

export default function StarRating({ value, onChange, readOnly = false, size = 'normal' }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`star ${star <= (hover || value) ? 'filled' : ''}`}
                    style={{
                        fontSize: size === 'small' ? '1.1rem' : undefined,
                        cursor: readOnly ? 'default' : 'pointer'
                    }}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    ★
                </span>
            ))}
            {!readOnly && value > 0 && (
                <span className="star-label">{STAR_LABELS[value]}</span>
            )}
        </div>
    );
}
