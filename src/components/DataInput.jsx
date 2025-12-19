import { useState, useRef } from 'react';
import './DataInput.css';

function DataInput({ dataPoints, setDataPoints, onDataApplied, onAutoSave }) {
    const [randomCount, setRandomCount] = useState('10');
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);
    const beforeEditState = useRef(null);

    const saveToHistory = (stateToSave = dataPoints) => {
        setHistory(prev => [...prev, stateToSave]);
        setFuture([]); // Clear redo stack on new action
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        setFuture(prev => [dataPoints, ...prev]);
        setDataPoints(previousState);
        setHistory(prev => prev.slice(0, -1));
        if (onAutoSave) onAutoSave(previousState);
    };

    const handleRedo = () => {
        if (future.length === 0) return;
        const nextState = future[0];
        setHistory(prev => [...prev, dataPoints]);
        setDataPoints(nextState);
        setFuture(prev => prev.slice(1));
        if (onAutoSave) onAutoSave(nextState);
    };

    const handleFocus = () => {
        beforeEditState.current = JSON.parse(JSON.stringify(dataPoints));
    };

    const handleBlur = () => {
        if (beforeEditState.current && JSON.stringify(beforeEditState.current) !== JSON.stringify(dataPoints)) {
            saveToHistory(beforeEditState.current);
        }
        beforeEditState.current = null;
    };

    const handleChange = (index, field, value) => {
        const newDataPoints = [...dataPoints];
        newDataPoints[index][field] = value;
        setDataPoints(newDataPoints);
        if (onAutoSave) onAutoSave(newDataPoints);
    };

    const handleAddRow = () => {
        saveToHistory();
        const newData = [...dataPoints, { x: '', y: '' }];
        setDataPoints(newData);
        if (onAutoSave) onAutoSave(newData);
    };

    const handleRemoveRow = (index) => {
        if (dataPoints.length > 1) {
            saveToHistory();
            const newDataPoints = dataPoints.filter((_, i) => i !== index);
            setDataPoints(newDataPoints);
            if (onAutoSave) onAutoSave(newDataPoints);
        }
    };

    const handleSmartExport = async () => {
        const validPoints = dataPoints.filter(p => p.x !== '' && p.y !== '');
        if (validPoints.length === 0) {
            alert('No data to export');
            return;
        }

        const text = validPoints.map(p => `${p.x}\t${p.y}`).join('\n');
        try {
            await navigator.clipboard.writeText(text);
            alert('Data copied to clipboard! You can now paste it into a spreadsheet.');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy data to clipboard');
        }
    };

    const handleSmartPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text.trim()) return;

            const lines = text.trim().split('\n');
            const newDataPoints = [];

            lines.forEach(line => {
                const parts = line.split(/\t|,|\s+/).filter(p => p.trim());
                if (parts.length >= 2) {
                    newDataPoints.push({ x: parts[0], y: parts[1] });
                } else if (parts.length === 1) {
                    newDataPoints.push({ x: parts[0], y: '' });
                }
            });

            if (newDataPoints.length > 0) {
                saveToHistory();
                setDataPoints(newDataPoints);
                if (onDataApplied) onDataApplied();
                if (onAutoSave) onAutoSave(newDataPoints);
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            alert('Please allow clipboard access to use Smart Paste');
        }
    };

    const handleRandomSample = () => {
        const count = parseInt(randomCount, 10);
        if (isNaN(count) || count <= 0) {
            alert('Please enter a valid count');
            return;
        }
        if (count > 100) {
            alert('Maximum count is 100');
            return;
        }
        const newPoints = Array.from({ length: count }, () => ({
            x: (Math.random() * 20000 - 10000).toFixed(2),
            y: (Math.random() * 20000 - 10000).toFixed(2)
        }));
        saveToHistory();
        setDataPoints(newPoints);
        if (onDataApplied) onDataApplied();
    };

    const handleClearAll = () => {
        saveToHistory();
        const newData = [{ x: '', y: '' }];
        setDataPoints(newData);
        if (onAutoSave) onAutoSave(newData);
    };

    const handleSwapData = () => {
        if (dataPoints.length === 0) return;
        saveToHistory();
        const newDataPoints = dataPoints.map(p => ({ x: p.y, y: p.x }));
        setDataPoints(newDataPoints);
        if (onDataApplied) onDataApplied();
        if (onAutoSave) onAutoSave(newDataPoints);
    };

    const [newPointX, setNewPointX] = useState('');
    const [newPointY, setNewPointY] = useState('');
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const handleQuickAdd = () => {
        if (!newPointX.trim() && !newPointY.trim()) return;

        const xLines = newPointX.trim().split('\n').map(l => l.trim());
        const yLines = newPointY.trim().split('\n').map(l => l.trim());
        const maxLines = Math.max(xLines.length, yLines.length);

        const newPoints = [];
        for (let i = 0; i < maxLines; i++) {
            const x = xLines[i] || '';
            const y = yLines[i] || '';
            if (x || y) {
                newPoints.push({ x, y });
            }
        }

        if (newPoints.length > 0) {
            saveToHistory();
            const finalPoints = [...dataPoints, ...newPoints];
            setDataPoints(finalPoints);
            setNewPointX('');
            setNewPointY('');
            if (onDataApplied) onDataApplied();
            if (onAutoSave) onAutoSave(finalPoints);
        }
    };

    // Remove the handleKeyDown function since we don't need Enter to submit anymore

    return (
        <div className="glass-card data-input-container">
            <div className="manual-input-section">
                <div className="input-header">
                    <h3>Data Points</h3>
                    <p className="text-muted text-small">
                        Add data points manually or
                        <button
                            onClick={handleSmartPaste}
                            className="inline-smart-paste-btn"
                            title="Paste two columns from spreadsheet at once"
                        >
                            ✨ Smart Paste
                        </button>
                        use Smart Export below.
                    </p>
                </div>
                {/* Top Toolbar */}
                <div className="flex justify-between items-center mb-sm wrap-controls">
                    <div className="flex gap-sm items-center">
                        <div className="flex flex-col gap-xs">
                            <button onClick={handleSwapData} className="btn-secondary btn-small" title="Swap X and Y values">
                                ⇄ Swap
                            </button>
                        </div>
                        <div className="input-group compact">
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={randomCount}
                                onChange={(e) => setRandomCount(e.target.value)}
                                className="small-input"
                                placeholder="#"
                            />
                            <button onClick={handleRandomSample} className="btn-secondary btn-small" title="Generate random sample">
                                🎲 Random
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="data-table">
                    <div className="table-header">
                        <div className="header-cell">#</div>
                        <div className="header-cell">X Value</div>
                        <div className="header-cell">Y Value</div>
                        <div className="header-cell">Actions</div>
                    </div>

                    <div className="table-body">
                        {dataPoints.map((point, index) => (
                            <div key={index} className="table-row fade-in">
                                <div className="cell index-cell">{index + 1}</div>
                                <div className="cell">
                                    <input
                                        type="text"
                                        value={point.x}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(index, 'x', e.target.value)}
                                        placeholder="X"
                                        className="thin-input"
                                    />
                                </div>
                                <div className="cell">
                                    <input
                                        type="text"
                                        value={point.y}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(index, 'y', e.target.value)}
                                        placeholder="Y"
                                        className="thin-input"
                                    />
                                </div>
                                <div className="cell">
                                    <button
                                        onClick={() => handleRemoveRow(index)}
                                        className="btn-danger btn-small"
                                        disabled={dataPoints.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="bottom-controls">
                    <div className="data-summary text-small text-muted mb-sm">
                        Total Points: <strong>{dataPoints.filter(p => p.x && p.y).length}</strong> / {dataPoints.length}
                    </div>

                    <div className="action-buttons flex gap-sm justify-center mb-sm">
                        <button
                            onClick={handleUndo}
                            className="btn-small btn-secondary"
                            disabled={history.length === 0}
                            title="Undo last action"
                        >
                            ↩️ Undo
                        </button>
                        <button
                            onClick={handleRedo}
                            className="btn-small btn-secondary"
                            disabled={future.length === 0}
                            title="Redo last undone action"
                        >
                            ↪️ Redo
                        </button>
                        <button onClick={handleAddRow} className="btn-small btn-secondary">
                            + Empty Row
                        </button>
                        <button
                            onClick={() => setShowQuickAdd(!showQuickAdd)}
                            className={`btn-small ${showQuickAdd ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {showQuickAdd ? '− Hide' : '+ Add+'}
                        </button>
                        <button onClick={handleClearAll} className="btn-small btn-danger">
                            🗑️ Clear All
                        </button>

                        <button
                            onClick={handleSmartExport}
                            className="btn-small btn-secondary"
                            title="Copy data to clipboard"
                        >
                            📋 Export
                        </button>
                    </div>

                    <div className={`quick-add-section ${showQuickAdd ? 'expanded' : 'collapsed'}`}>
                        <div className="input-group full-width">
                            <textarea
                                value={newPointX}
                                onChange={(e) => setNewPointX(e.target.value)}
                                placeholder="New X (multi-line)"
                                className="thin-input multi-line-input"
                                rows={2}
                            />
                            <textarea
                                value={newPointY}
                                onChange={(e) => setNewPointY(e.target.value)}
                                placeholder="New Y (multi-line)"
                                className="thin-input multi-line-input"
                                rows={2}
                            />
                            <button onClick={handleQuickAdd} className="btn-success h-full">
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataInput;