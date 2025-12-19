import React, { useMemo, useState } from 'react';
import SheetControls from './SheetControls';
import RoundTripValidation from './RoundTripValidation';
import DataInput from './DataInput';
import CommentModal from './CommentModal';
import TipsModal from './TipsModal';
import { getValidPoints, calculateRanges, calculateUnitsPerMm } from '../utils/chartMapping';
import { saveAppFeedback } from '../services/firebaseService';
import './Sidebar.css';

function Sidebar({
    activeTab,
    onTabChange,
    sheetSize,
    setSheetSize,
    squeeze,
    setSqueeze,
    scales,
    dataPoints,
    setDataPoints,
    onDataApplied,
    tickCounts,
    setTickCounts,
    show10mmMarkers,
    setShow10mmMarkers,
    tickLabelMode,
    setTickLabelMode,
    chartZoom,
    setChartZoom,

    onAutoSave,
    sessionId,
    sessionStartTime,
    lastActionTime
}) {
    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            onTabChange(null); // Collapse if clicking active tab
        } else {
            onTabChange(tab);
        }
    };

    const handleZoomIn = () => {
        setChartZoom(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setChartZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    // Feedback Modal state
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedbackSubmit = async (feedback) => {
        setIsSubmitting(true);
        try {
            const currentTime = Date.now();
            await saveAppFeedback({
                feedback,
                validPoints,
                sheetSize,
                squeeze,
                sessionId,
                sessionStartTime,
                duration: currentTime - sessionStartTime,
                interval: currentTime - lastActionTime
            });
            alert('Feedback sent successfully! Thank you!');
            setIsFeedbackModalOpen(false);
        } catch (error) {
            alert('Failed to send feedback. Please check your Firebase configuration.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tips Modal state
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);



    const getPanelTitle = () => {
        switch (activeTab) {
            case 'sheet': return 'Sheet Dimensions';
            case 'data': return 'Data Points';
            case 'validation': return 'Round Trip Validation';
            default: return '';
        }
    };

    // Calculate ranges and unitsPerMm for RoundTripValidation
    const validPoints = useMemo(() => getValidPoints(dataPoints), [dataPoints]);
    const ranges = useMemo(() => calculateRanges(validPoints), [validPoints]);
    const unitsPerMm = useMemo(() => calculateUnitsPerMm(ranges, sheetSize, squeeze), [ranges, sheetSize, squeeze]);
    const tickAt0 = useMemo(() => ({
        x: ranges.minX - squeeze.x * unitsPerMm.x,
        y: ranges.minY - squeeze.y * unitsPerMm.y
    }), [ranges, squeeze, unitsPerMm]);

    return (
        <div className="sidebar-container">
            <div className="activity-bar">
                <div className="activity-top">
                    <button
                        className={`activity-item ${activeTab === 'sheet' ? 'active' : ''}`}
                        onClick={() => handleTabClick('sheet')}
                        title="Sheet Dimensions"
                    >
                        <span className="activity-icon">📏</span>
                    </button>
                    <button
                        className={`activity-item ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => handleTabClick('data')}
                        title="Data Points"
                    >
                        <span className="activity-icon">📝</span>
                    </button>
                    <button
                        className={`activity-item ${activeTab === 'validation' ? 'active' : ''}`}
                        onClick={() => handleTabClick('validation')}
                        title="Round Trip Validation"
                    >
                        <span className="activity-icon">🔄</span>
                    </button>
                </div>
                <div className="activity-bottom">

                    <button
                        className="activity-item"
                        onClick={handleZoomIn}
                        title="Zoom In Chart"
                    >
                        <span className="activity-icon" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</span>
                    </button>
                    <button
                        className="activity-item"
                        onClick={() => setChartZoom(1)}
                        title="Fit Chart"
                    >
                        <span className="activity-icon" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>⤢</span>
                    </button>
                    <button
                        className="activity-item"
                        onClick={handleZoomOut}
                        title="Zoom Out Chart"
                    >
                        <span className="activity-icon" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>−</span>
                    </button>
                    <a
                        href="https://sheets.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="activity-item"
                        title="Open Google Sheets"
                    >
                        <svg className="activity-icon" viewBox="0 0 24 24" width="24" height="24" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </a>
                    <button
                        className="activity-item"
                        onClick={() => setIsFeedbackModalOpen(true)}
                        title="Send Feedback"
                    >
                        <svg className="activity-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" style={{ minWidth: '24px', minHeight: '24px' }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                        </svg>
                    </button>
                    <button
                        className="activity-item"
                        onClick={() => setIsTipsModalOpen(true)}
                        title="Tips & Tricks"
                    >
                        <svg className="activity-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" style={{ minWidth: '24px', minHeight: '24px' }}>
                            <path d="M9 18h6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M10 22h4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M12 2v1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M12 15a5 5 0 0 1-5-5 5 5 0 0 1 10 0 5 5 0 0 1-5 5z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {activeTab && (
                <div className="side-panel">
                    <div className="panel-header">
                        <h3>{getPanelTitle()}</h3>
                    </div>
                    <div className="panel-content">
                        {activeTab === 'sheet' ? (
                            <SheetControls
                                sheetSize={sheetSize}
                                setSheetSize={setSheetSize}
                                squeeze={squeeze}
                                setSqueeze={setSqueeze}
                                scales={scales}
                                tickCounts={tickCounts}
                                setTickCounts={setTickCounts}
                                show10mmMarkers={show10mmMarkers}
                                setShow10mmMarkers={setShow10mmMarkers}
                                tickLabelMode={tickLabelMode}
                                setTickLabelMode={setTickLabelMode}
                            />
                        ) : activeTab === 'data' ? (
                            <DataInput
                                dataPoints={dataPoints}
                                setDataPoints={setDataPoints}
                                onDataApplied={onDataApplied}
                                onAutoSave={onAutoSave}
                            />
                        ) : (
                            <RoundTripValidation
                                dataPoints={dataPoints}
                                sheetSize={sheetSize}
                                squeeze={squeeze}
                                ranges={ranges}
                                unitsPerMm={unitsPerMm}
                                tickAt0={tickAt0}
                            />
                        )}
                    </div>
                </div>
            )}

            <CommentModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
                isSubmitting={isSubmitting}
            />

            <TipsModal
                isOpen={isTipsModalOpen}
                onClose={() => setIsTipsModalOpen(false)}
            />
        </div>
    );
}

export default Sidebar;
