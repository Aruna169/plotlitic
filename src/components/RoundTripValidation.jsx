import React from 'react';
import { formatScientific } from '../utils/formatting';
import './DataInput.css'; // Reuse existing styles for consistency

function RoundTripValidation({ dataPoints, sheetSize, squeeze, ranges, unitsPerMm, tickAt0 }) {
    // Implement reverse calculation logic
    // Formula: data value -> mm position -> reverse back to data value
    // Forward: dataValue -> mm = (dataValue - minValue) / unitsPerMm + squeeze
    // Reverse: mm -> dataValue = mm * unitsPerMm + tickAt0
    const reverseCalculate = (point) => {
        if (!point.x || !point.y || isNaN(point.x) || isNaN(point.y)) {
            return { x: '', y: '' };
        }

        const dataX = parseFloat(point.x);
        const dataY = parseFloat(point.y);

        // Convert data value to mm position
        const mmX = (dataX - ranges.minX) / unitsPerMm.x + squeeze.x;
        const mmY = (dataY - ranges.minY) / unitsPerMm.y + squeeze.y;

        // Reverse: mm back to data value using mm * scale + tickAt0
        const revX = mmX * unitsPerMm.x + tickAt0.x;
        const revY = mmY * unitsPerMm.y + tickAt0.y;

        return {
            x: revX.toFixed(6),
            y: revY.toFixed(6)
        };
    };

    const isMatch = (val1, val2) => {
        if (!val1 && !val2) return true;
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);
        if (isNaN(v1) || isNaN(v2)) return false;
        // Allow small floating point errors
        return Math.abs(v1 - v2) < 0.0001;
    };

    return (
        <div className="glass-card data-input-container">
            <div className="manual-input-section">
                <div className="flex justify-between items-center mb-sm">
                    <h3>Round Trip Validation</h3>
                </div>

                {/* Scale Information Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div className="stat-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>X Scale</div>
                        <div className="stat-value" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
                            1mm → {formatScientific(unitsPerMm.x)} units
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div className="stat-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Y Scale</div>
                        <div className="stat-value" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
                            1mm → {formatScientific(unitsPerMm.y)} units
                        </div>
                    </div>
                </div>

                {/* Scrollable table container with fixed height */}
                <div className="data-table-container">
                    <div className="table-header" style={{ gridTemplateColumns: '40px 1fr 1fr 60px' }}>
                        <div className="header-cell">#</div>
                        <div className="header-cell">X Value</div>
                        <div className="header-cell">Y Value</div>
                        <div className="header-cell">Status</div>
                    </div>

                    <div className="table-body">
                        {dataPoints.map((point, index) => {
                            const reverse = reverseCalculate(point);
                            const xMatch = isMatch(point.x, reverse.x);
                            const yMatch = isMatch(point.y, reverse.y);
                            const allMatch = xMatch && yMatch && point.x && point.y;

                            return (
                                <div key={index} className="table-row fade-in" style={{ gridTemplateColumns: '40px 1fr 1fr 60px' }}>
                                    <div className="cell index-cell">{index + 1}</div>
                                    <div className="cell" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {point.x || '-'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {reverse.x || '-'}
                                        </div>
                                    </div>
                                    <div className="cell" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {point.y || '-'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {reverse.y || '-'}
                                        </div>
                                    </div>
                                    <div className="cell text-center">
                                        {point.x && point.y ? (
                                            allMatch ? (
                                                <span className="text-success" title="Values match">✅</span>
                                            ) : (
                                                <span className="text-danger" title="Values differ">❗</span>
                                            )
                                        ) : (
                                            <span className="text-muted" title="Incomplete data">-</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content that stays below the table */}
                <div className="content-below-table">
                    <div className="data-summary text-small text-muted mb-sm">
                        Valid Points: <strong>{dataPoints.filter(p => p.x && p.y).length}</strong> / {dataPoints.length}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoundTripValidation;