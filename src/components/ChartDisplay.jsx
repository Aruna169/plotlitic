import { useEffect, useRef, useMemo } from 'react';
import { formatScientific } from '../utils/formatting';
import { createXAxisConfig, createYAxisConfig } from '../utils/chartAxisConfig';
import { createGridConfig } from '../utils/chartGridConfig';
import { getScientificParts } from '../utils/chartTickUtils';
import {
    getValidPoints,
    calculateRanges,
    calculateUnitsPerMm,
    mapPointsToPhysical
} from '../utils/chartMapping';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import './ChartDisplay.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function ChartDisplay({ dataPoints, sheetSize, squeeze, tickCounts, show10mmMarkers, tickLabelMode, chartZoom = 1 }) {
    const chartRef = useRef(null);

    // Filter valid data points and convert to numbers
    const validPoints = useMemo(() => getValidPoints(dataPoints), [dataPoints]);

    // Calculate data ranges
    const ranges = useMemo(() => calculateRanges(validPoints), [validPoints]);

    // Calculate units per mm
    const unitsPerMm = useMemo(() =>
        calculateUnitsPerMm(ranges, sheetSize, squeeze),
        [ranges, sheetSize, squeeze]
    );
    const { x: unitsPerMmX, y: unitsPerMmY } = unitsPerMm;

    // Map points to physical coordinates
    const { mappedPoints, axisLines } = useMemo(() =>
        mapPointsToPhysical(validPoints, ranges, sheetSize, squeeze),
        [validPoints, ranges, sheetSize, squeeze]
    );

    const chartData = {
        datasets: [
            ...axisLines,
            {
                label: 'Physical Points',
                data: mappedPoints,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBorderWidth: 2,
                pointBorderColor: '#fff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: sheetSize.x / sheetSize.y,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#e4e7f1',
                    font: { family: 'Inter', size: 12 },
                },
            },
            title: {
                display: true,
                text: `Physical Sheet Layout (${sheetSize.x}mm × ${sheetSize.y}mm)`,
                color: '#e4e7f1',
                font: { family: 'Inter', size: 16, weight: '600' },
                padding: 20,
            },
            tooltip: {
                backgroundColor: 'rgba(26, 32, 48, 0.95)',
                titleColor: '#e4e7f1',
                bodyColor: '#a0a8c0',
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        const x = context.parsed.x;
                        const y = context.parsed.y;
                        const dataX = (ranges.minX - squeeze.x * unitsPerMmX) + x * unitsPerMmX;
                        const dataY = (ranges.minY - squeeze.y * unitsPerMmY) + y * unitsPerMmY;
                        return `Pos: (${x.toFixed(1)}mm, ${y.toFixed(1)}mm) | Val: (${formatScientific(dataX)}, ${formatScientific(dataY)})`;
                    }
                }
            }
        },
        scales: {
            x: {
                ...createXAxisConfig({
                    sheetSize,
                    ranges,
                    squeeze,
                    unitsPerMm,
                    show10mmMarkers,
                    formatScientific,
                    tickLabelMode,
                    tickCounts
                }),
                grid: {
                    display: tickLabelMode !== 'interval', // Hide grid on main axis if interval mode
                    ...createXAxisConfig({
                        sheetSize,
                        ranges,
                        squeeze,
                        unitsPerMm,
                        show10mmMarkers,
                        formatScientific,
                        tickLabelMode,
                        tickCounts
                    }).grid
                }
            },
            y: {
                ...createYAxisConfig({
                    sheetSize,
                    ranges,
                    squeeze,
                    unitsPerMm,
                    show10mmMarkers,
                    formatScientific,
                    tickLabelMode,
                    tickCounts
                }),
                grid: {
                    display: tickLabelMode !== 'interval', // Hide grid on main axis if interval mode
                    ...createYAxisConfig({
                        sheetSize,
                        ranges,
                        squeeze,
                        unitsPerMm,
                        show10mmMarkers,
                        formatScientific,
                        tickLabelMode,
                        tickCounts
                    }).grid
                }
            },
            // Secondary axes for grid lines when in interval mode
            ...(tickLabelMode === 'interval' ? {
                xGrid: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: sheetSize.x,
                    grid: createGridConfig(show10mmMarkers),
                    ticks: { display: false, stepSize: 10 }, // Force 10mm step
                    border: { display: false },
                    title: { display: false }
                },
                yGrid: {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: sheetSize.y,
                    grid: createGridConfig(show10mmMarkers),
                    ticks: { display: false, stepSize: 10 }, // Force 10mm step
                    border: { display: false },
                    title: { display: false }
                }
            } : {})
        },
    };

    const axisLabelPlugin = {
        id: 'axisLabels',
        afterDatasetsDraw: (chart) => {
            const { ctx } = chart;

            chart.data.datasets.forEach((dataset, i) => {
                if (!dataset.label || !dataset.label.includes('axis')) return;
                if (!chart.isDatasetVisible(i)) return;

                const meta = chart.getDatasetMeta(i);
                if (!meta.data || meta.data.length < 2) return;

                const start = meta.data[0];

                ctx.save();
                ctx.font = '12px Inter';
                ctx.fillStyle = '#e4e7f1';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';

                if (dataset.label.startsWith('y axis')) {
                    ctx.fillText(dataset.label, start.x + 5, start.y - 5);
                } else if (dataset.label.startsWith('x axis')) {
                    ctx.fillText(dataset.label, start.x + 5, start.y - 5);
                }

                ctx.restore();
            });
        }
    };

    return (
        <div className="glass-card chart-display-container">
            {validPoints.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No Data Points Yet</h3>
                    <p className="text-muted">
                        Add data points manually or paste from Excel to see your chart
                    </p>
                </div>
            ) : (
                <>
                    <div className="chart-wrapper" style={{ transform: `scale(${chartZoom})`, transformOrigin: 'center center' }}>
                        <Scatter
                            key={`chart-${sheetSize.x}-${sheetSize.y}`}
                            ref={chartRef}
                            data={chartData}
                            options={options}
                            plugins={[axisLabelPlugin]}
                        />
                    </div>

                    <div className="chart-stats">
                        <div className="stat-card">
                            <div className="stat-label">Total Points</div>
                            <div className="stat-value">{validPoints.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Drawing Area</div>
                            <div className="stat-value">
                                {sheetSize.x - 2 * squeeze.x} × {sheetSize.y - 2 * squeeze.y} mm
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">X Scale</div>
                            <div className="stat-value">
                                <div>1mm → {formatScientific(unitsPerMmX)} units</div>
                                <div className="text-small text-muted" style={{ marginTop: '4px' }}>
                                    Tick at 0mm: {formatScientific(ranges.minX - squeeze.x * unitsPerMmX)}
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Y Scale</div>
                            <div className="stat-value">
                                <div>1mm → {formatScientific(unitsPerMmY)} units</div>
                                <div className="text-small text-muted" style={{ marginTop: '4px' }}>
                                    Tick at 0mm: {formatScientific(ranges.minY - squeeze.y * unitsPerMmY)}
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

export default ChartDisplay;
