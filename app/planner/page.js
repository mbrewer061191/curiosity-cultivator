'use client';
import { useState, useMemo } from 'react';
import { useActivities } from '../hooks/useActivities';
import { usePlanner } from '../hooks/usePlanner';
import { PDFDocument, rgb } from 'pdf-lib';

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
            // Load base PDF
            const url = '/lesson_plan_template.pdf';
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0]; // Assuming it's a 1-page template

            // We will draw text onto the PDF. Since we don't have exact coordinates, 
            // we will approximate some fields or append a new page with the details.
            // Since the user said it's a template she fills out, let's list the planned activities.
            let yOffset = firstPage.getHeight() - 150;
            
            firstPage.drawText(`Lesson Plan: ${currentMonth + 1}/${currentYear}`, {
                x: 50,
                y: firstPage.getHeight() - 50,
                size: 16,
                color: rgb(0, 0, 0),
            });

            // Very basic text drawing since we don't know the exact bounding boxes
            // We will iterate through planned activities and list them
            const sortedPlanned = [...planned].sort((a, b) => a.date.localeCompare(b.date));
            for (const p of sortedPlanned) {
                const act = activities.find(a => a.id === p.activity_id);
                if (!act) continue;
                
                firstPage.drawText(`${p.date}: ${act.title}`, {
                    x: 50,
                    y: yOffset,
                    size: 12,
                    color: rgb(0.1, 0.1, 0.8),
                });
                
                if (act.notes) {
                    yOffset -= 15;
                    // Truncate notes if too long for simple drawing
                    firstPage.drawText(`   Notes: ${act.notes.substring(0, 80)}...`, {
                        x: 50,
                        y: yOffset,
                        size: 10,
                    });
                }
                
                yOffset -= 25;
                if (yOffset < 50) break; // Out of space on page 1
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
                            
                            return (
                                <div 
                                    key={day} 
                                    onClick={() => handleDateClick(day)}
                                    style={{ 
                                        padding: '10px 5px', 
                                        background: isSelected ? 'var(--primary-color)' : '#fff', 
                                        color: isSelected ? '#fff' : '#333',
                                        border: '1px solid #ddd', 
                                        borderRadius: 8, 
                                        cursor: 'pointer',
                                        minHeight: 80,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold' }}>{day}</span>
                                    {dayPlanned.length > 0 && (
                                        <div style={{ marginTop: 4, fontSize: '0.7rem', background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--primary-color)', color: isSelected ? '#fff' : '#fff', padding: '2px 6px', borderRadius: 12 }}>
                                            {dayPlanned.length} act.
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
