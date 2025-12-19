import './SheetControls.css';
import { formatScientific } from '../utils/formatting';

function SheetControls({ sheetSize, setSheetSize, squeeze, setSqueeze, scales, tickCounts, setTickCounts, show10mmMarkers, setShow10mmMarkers, tickLabelMode, setTickLabelMode }) {
    const handleToggle = () => {
        setSheetSize({ x: sheetSize.y, y: sheetSize.x });
    };

    const handleChange = (dimension, value) => {
        const numValue = parseFloat(value) || 0;
        setSheetSize({ ...sheetSize, [dimension]: numValue });
    };

    const handleTickCountChange = (axis, value) => {
        const numValue = parseInt(value) || 1;
        setTickCounts({ ...tickCounts, [axis]: Math.max(1, numValue) });
    };

    return (
        <div className="glass-card sheet-controls-container">
            <h2>📏 Sheet Dimensions</h2>
            <p className="text-small text-muted mb-md">Set your physical graph sheet size in millimeters</p>

            <div className="dimension-inputs">
                <div className="input-group">
                    <label htmlFor="sheet-x">Width (X-axis)</label>
                    <div className="input-with-unit">
                        <input
                            id="sheet-x"
                            type="number"
                            value={sheetSize.x}
                            onChange={(e) => handleChange('x', e.target.value)}
                            min="1"
                            step="1"
                        />
                        <span className="unit">mm</span>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="sheet-y">Height (Y-axis)</label>
                    <div className="input-with-unit">
                        <input
                            id="sheet-y"
                            type="number"
                            value={sheetSize.y}
                            onChange={(e) => handleChange('y', e.target.value)}
                            min="1"
                            step="1"
                        />
                        <span className="unit">mm</span>
                    </div>
                </div>
            </div>

            <button onClick={handleToggle} className="btn-secondary w-full mb-lg">
                🔄 Swap Dimensions
            </button>

            <div className="squeeze-controls mb-lg">
                <h3>Graph Margins (Squeeze)</h3>
                <div className="slider-group">
                    <div className="slider-item">
                        <div className="flex justify-between mb-xs">
                            <label htmlFor="squeeze-x">
                                X Squeeze
                                {scales && scales.x > 0 && <span className="text-xs text-muted ml-sm">(1mm = {formatScientific(scales.x)})</span>}
                            </label>
                            <span className="text-small text-muted">{squeeze.x}mm</span>
                        </div>
                        <input
                            id="squeeze-x"
                            type="range"
                            min="0"
                            max="30"
                            value={squeeze.x}
                            onChange={(e) => setSqueeze({ ...squeeze, x: parseFloat(e.target.value) })}
                            className="range-slider"
                        />
                    </div>

                    <div className="slider-item">
                        <div className="flex justify-between mb-xs">
                            <label htmlFor="squeeze-y">
                                Y Squeeze
                                {scales && scales.y > 0 && <span className="text-xs text-muted ml-sm">(1mm = {formatScientific(scales.y)})</span>}
                            </label>
                            <span className="text-small text-muted">{squeeze.y}mm</span>
                        </div>
                        <input
                            id="squeeze-y"
                            type="range"
                            min="0"
                            max="30"
                            value={squeeze.y}
                            onChange={(e) => setSqueeze({ ...squeeze, y: parseFloat(e.target.value) })}
                            className="range-slider"
                        />
                    </div>
                </div>
            </div>

            <div className="tick-counts-controls mb-lg">
                <h3>Axis Tick Counts</h3>
                <div className="dimension-inputs">
                    <div className="input-group">
                        <label htmlFor="tick-x">X Axis Ticks</label>
                        <input
                            id="tick-x"
                            type="number"
                            value={tickCounts.x}
                            onChange={(e) => handleTickCountChange('x', e.target.value)}
                            min="1"
                            max="20"
                            step="1"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="tick-y">Y Axis Ticks</label>
                        <input
                            id="tick-y"
                            type="number"
                            value={tickCounts.y}
                            onChange={(e) => handleTickCountChange('y', e.target.value)}
                            min="1"
                            max="20"
                            step="1"
                        />
                    </div>
                </div>

                <div className="tick-mode-control mt-md">
                    <label className="block text-small text-muted mb-xs">Tick Labeling</label>
                    <div className="segmented-control">
                        <button
                            className={`segment-btn ${tickLabelMode === 'none' ? 'active' : ''}`}
                            onClick={() => setTickLabelMode('none')}
                            title="No tick labels"
                        >
                            None
                        </button>
                        <button
                            className={`segment-btn ${tickLabelMode === 'interval' ? 'active' : ''}`}
                            onClick={() => setTickLabelMode('interval')}
                            title="Show labels at intervals"
                        >
                            Interval
                        </button>
                        <button
                            className={`segment-btn ${tickLabelMode === 'all' ? 'active' : ''}`}
                            onClick={() => setTickLabelMode('all')}
                            title="Show all labels (10mm)"
                        >
                            All
                        </button>
                    </div>
                </div>

                <div className="toggle-container mt-sm">
                    <label className="toggle-label">
                        <span>Show 10mm Grid</span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={show10mmMarkers}
                                onChange={(e) => setShow10mmMarkers(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="sheet-info">
                <div className="info-item">
                    <span className="info-label">Orientation:</span>
                    <span className="info-value">
                        {sheetSize.x > sheetSize.y ? '📄 Landscape' : '📑 Portrait'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SheetControls;
