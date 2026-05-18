'use client';
import { useState, useMemo } from 'react';
import { useActivities } from '../hooks/useActivities';
import { usePlanner } from '../hooks/usePlanner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function getHoliday(year, month, day) {
    const fixed = {
        '0-1': { name: "New Year's Day", icon: '🎆' },
        '1-14': { name: "Valentine's Day", icon: '💖' },
        '2-17': { name: "St. Patrick's Day", icon: '☘️' },
        '3-1': { name: "April Fools", icon: '🃏' },
        '4-5': { name: "Cinco de Mayo", icon: '🌮' },
        '5-19': { name: "Juneteenth", icon: '✊🏿' },
        '6-4': { name: "Independence Day", icon: '🎆' },
        '9-31': { name: "Halloween", icon: '🎃' },
        '10-11': { name: "Veterans Day", icon: '🎖️' },
        '11-25': { name: "Christmas", icon: '🎄' },
        '11-31': { name: "New Year's Eve", icon: '🥂' },
    };
    const key = `${month}-${day}`;
    if (fixed[key]) return fixed[key];

    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const nthWeek = Math.floor((day - 1) / 7) + 1;
    const isLastWeek = day + 7 > new Date(year, month + 1, 0).getDate();

    if (month === 4 && dayOfWeek === 0 && nthWeek === 2) return { name: "Mother's Day", icon: '💐' };
    if (month === 5 && dayOfWeek === 0 && nthWeek === 3) return { name: "Father's Day", icon: '👔' };
    if (month === 10 && dayOfWeek === 4 && nthWeek === 4) return { name: "Thanksgiving", icon: '🦃' };
    if (month === 4 && dayOfWeek === 1 && isLastWeek) return { name: "Memorial Day", icon: '🇺🇸' };
    if (month === 8 && dayOfWeek === 1 && nthWeek === 1) return { name: "Labor Day", icon: '🛠️' };
    if (month === 0 && dayOfWeek === 1 && nthWeek === 3) return { name: "MLK Jr. Day", icon: '🕊️' };
    if (month === 1 && dayOfWeek === 1 && nthWeek === 3) return { name: "Presidents' Day", icon: '🏛️' };

    return null;
}
export default function PlannerPage() {
    const { activities, loaded: actsLoaded } = useActivities();
    
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    // Format: "YYYY-MM" (e.g., "2026-05")
    const monthYearString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const { planned, addPlannedActivity, removePlannedActivity, loaded: planLoaded } = usePlanner(monthYearString);

    const [selectedDate, setSelectedDate] = useState(null);
    const [showShoppingList, setShowShoppingList] = useState(false);

    // Calendar logic
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const changeMonth = (offset) => {
        let newMonth = currentMonth + offset;
        let newYear = currentYear;
        if (newMonth > 11) { newMonth = 0; newYear++; }
        if (newMonth < 0) { newMonth = 11; newYear--; }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    };

    const handleDateClick = (day) => {
        const dateStr = `${monthYearString}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
    };

    const handleAssign = (activityId) => {
        if (!selectedDate) return;
        addPlannedActivity(activityId, selectedDate);
    };

    const plannedMap = useMemo(() => {
        const map = {};
        planned.forEach(p => {
            if (!map[p.date]) map[p.date] = [];
            map[p.date].push(p);
        });
        return map;
    }, [planned]);

    // Gather shopping list
    const shoppingList = useMemo(() => {
        const items = [];
        planned.forEach(p => {
            const act = activities.find(a => a.id === p.activity_id);
            if (act && act.supplies) {
                items.push({ date: p.date, title: act.title, supplies: act.supplies });
            }
        });
        return items.sort((a, b) => a.date.localeCompare(b.date));
    }, [planned, activities]);

    const handleExportPDF = async () => {
        try {
            const url = '/lesson_plan_template.pdf';
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0]; 

            // Header positioning - Move this so it doesn't overlap "Individualizations"
            // The template header seems to have space around y = height - 60
            firstPage.drawText(`Lesson Plan: ${currentMonth + 1}/${currentYear}`, {
                x: 60,
                y: firstPage.getHeight() - 75,
                size: 14,
                font: font,
                color: rgb(0, 0, 0),
            });

            // The table starts lower. Based on the screenshot, y=height - 135 seems to be the first row baseline.
            // Row height is exactly 15.
            let yOffset = firstPage.getHeight() - 135;
            
            const sortedPlanned = [...planned].sort((a, b) => a.date.localeCompare(b.date));
            
            // Helper to wrap text
            const wrapText = (text, maxWidth, fontSize) => {
                const words = text.split(' ');
                let lines = [];
                let currentLine = words[0] || '';

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                if (currentLine) lines.push(currentLine);
                return lines;
            };

            for (const p of sortedPlanned) {
                const act = activities.find(a => a.id === p.activity_id);
                if (!act) continue;
                
                // Collect skills
                const skills = [];
                ['explorer', 'artist', 'detective', 'mapmaker'].forEach(k => { if (act[k]) skills.push(k.charAt(0).toUpperCase() + k.slice(1)); });
                ['grossMotor', 'fineMotor', 'outdoor'].forEach(k => { if (act[k]) skills.push(k.replace('Motor', ' Motor')); });
                const skillText = skills.length > 0 ? skills.join(', ') : 'General';
                
                // Prepare column content
                // Col 1: Date (x: 55, width: 110)
                const dateText = p.date.split('-').slice(1).join('/'); // "05-01" -> "05/01"
                
                // Col 2: Skill (x: 175, width: 140)
                const skillLines = wrapText(skillText, 135, 10);
                
                // Col 3: Activity (x: 325, width: 230)
                const actText = `${act.title}${act.notes ? ' - ' + act.notes : ''}`;
                const actLines = wrapText(actText, 220, 10);
                
                // Determine how many rows this entry will take
                const maxLines = Math.max(1, skillLines.length, actLines.length);
                
                // Draw cells
                for (let i = 0; i < maxLines; i++) {
                    // Col 1 (only on first line)
                    if (i === 0) {
                        firstPage.drawText(dateText, { x: 55, y: yOffset, size: 10, font });
                    }
                    // Col 2
                    if (skillLines[i]) {
                        firstPage.drawText(skillLines[i], { x: 175, y: yOffset, size: 10, font });
                    }
                    // Col 3
                    if (actLines[i]) {
                        firstPage.drawText(actLines[i], { x: 325, y: yOffset, size: 10, font });
                    }
                    
                    yOffset -= 15; // Move down 1 row
                    if (yOffset < 50) break; 
                }
                
                if (yOffset < 50) break; // Out of space
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Lesson_Plan_${currentYear}_${currentMonth + 1}.pdf`;
            link.click();
        } catch (e) {
            console.error(e);
            alert("Error exporting PDF. Make sure lesson_plan_template.pdf is in the public folder.");
        }
    };

    if (!actsLoaded || !planLoaded) return null;

    const selectedDatePlanned = selectedDate ? (plannedMap[selectedDate] || []) : [];

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>📅 Lesson Planner</h1>
                    <p>Plan your activities and generate shopping lists.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setShowShoppingList(true)}>🛒 Shopping List</button>
                    <button className="btn btn-primary" onClick={handleExportPDF}>📄 Export PDF</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {/* Calendar View */}
                <div className="card" style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => changeMonth(-1)}>◀ Prev</button>
                        <h2 style={{ margin: 0 }}>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button className="btn btn-secondary btn-sm" onClick={() => changeMonth(1)}>Next ▶</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} style={{ padding: 10, background: '#f5f5f5', borderRadius: 8 }}></div>
                        ))}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${monthYearString}-${String(day).padStart(2, '0')}`;
                            const isSelected = selectedDate === dateStr;
                            const dayPlanned = plannedMap[dateStr] || [];
                            const holiday = getHoliday(currentYear, currentMonth, day);
                            
                            return (
                                <div 
                                    key={day} 
                                    onClick={() => handleDateClick(day)}
                                    style={{ 
                                        padding: '10px 5px', 
                                        background: isSelected ? 'var(--primary-color)' : (holiday ? '#f0f9ff' : '#fff'), 
                                        color: isSelected ? '#fff' : '#333',
                                        border: isSelected ? '1px solid var(--primary-color)' : (holiday ? '1px solid #bae6fd' : '1px solid #e5e7eb'), 
                                        borderRadius: 12, 
                                        cursor: 'pointer',
                                        minHeight: 100,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxShadow: holiday && !isSelected ? '0 2px 4px rgba(0,0,0,0.02)' : 'none',
                                        transition: 'all 0.2s ease',
                                    }}
                                    className="calendar-day"
                                >
                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{day}</span>
                                    {holiday && (
                                        <div style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: 'auto', color: isSelected ? '#e0f2fe' : '#0284c7', fontWeight: 500, lineHeight: 1.2 }}>
                                            <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: 2 }}>{holiday.icon}</span>
                                            {holiday.name}
                                        </div>
                                    )}
                                    {dayPlanned.length > 0 && (
                                        <div style={{ marginTop: 'auto', marginBottom: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--primary-color)', color: '#fff', padding: '3px 8px', borderRadius: 12, fontWeight: 'bold' }}>
                                                {dayPlanned.length} act.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Day Editor */}
                <div className="card" style={{ flex: '1 1 300px' }}>
                    {selectedDate ? (
                        <>
                            <h3>Plan for {selectedDate}</h3>
                            <p className="section-caption">Assign activities to this date.</p>
                            
                            {selectedDatePlanned.length > 0 && (
                                <div style={{ marginTop: 16, marginBottom: 24 }}>
                                    <strong>Planned Activities:</strong>
                                    {selectedDatePlanned.map(p => {
                                        const act = activities.find(a => a.id === p.activity_id);
                                        return (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9f9f9', borderRadius: 6, marginTop: 8 }}>
                                                <span>{act?.title || 'Unknown'}</span>
                                                <button className="btn btn-sm btn-danger" onClick={() => removePlannedActivity(p.id)}>✕</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div>
                                <strong>Add from Library:</strong>
                                <select 
                                    className="form-select" 
                                    style={{ width: '100%', marginTop: 8 }}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAssign(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                >
                                    <option value="">-- Select an Activity --</option>
                                    {activities.map(a => (
                                        <option key={a.id} value={a.id}>{a.title}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            👈 Select a date on the calendar to plan activities!
                        </div>
                    )}
                </div>
            </div>

            {/* Shopping List Modal */}
            {showShoppingList && (
                <div className="modal-overlay" onClick={() => setShowShoppingList(false)}>
                    <div className="modal pop-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🛒 Shopping List for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <button className="modal-close" onClick={() => setShowShoppingList(false)}>✕</button>
                        </div>
                        
                        {shoppingList.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No supplies needed for planned activities this month.</p>
                        ) : (
                            <div style={{ marginTop: 16 }}>
                                <button className="btn btn-primary btn-sm" style={{ marginBottom: 16 }} onClick={() => window.print()}>🖨️ Print List</button>
                                {shoppingList.map((item, idx) => (
                                    <div key={idx} style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date} - {item.title}</div>
                                        <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{item.supplies}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
