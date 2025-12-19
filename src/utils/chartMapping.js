/**
 * Chart Mapping Utilities
 * Handles data processing and coordinate mapping for the chart
 */

/**
 * Filter valid data points and convert to numbers
 */
export const getValidPoints = (dataPoints) => {
    return dataPoints
        .filter(point => point.x !== '' && point.y !== '' && !isNaN(point.x) && !isNaN(point.y))
        .map(point => ({
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        }));
};

/**
 * Calculate data ranges (min/max X and Y)
 */
export const calculateRanges = (validPoints) => {
    if (validPoints.length === 0) {
        return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }

    const xValues = validPoints.map(p => p.x);
    const yValues = validPoints.map(p => p.y);

    return {
        minX: Math.min(...xValues),
        maxX: Math.max(...xValues),
        minY: Math.min(...yValues),
        maxY: Math.max(...yValues)
    };
};

/**
 * Calculate units per mm for X and Y axes
 */
export const calculateUnitsPerMm = (ranges, sheetSize, squeeze) => {
    const unitsPerMmX = (ranges.maxX - ranges.minX) / (sheetSize.x - 2 * squeeze.x);
    const unitsPerMmY = (ranges.maxY - ranges.minY) / (sheetSize.y - 2 * squeeze.y);
    return { x: unitsPerMmX, y: unitsPerMmY };
};

/**
 * Map points to physical coordinates on the sheet
 */
export const mapPointsToPhysical = (validPoints, ranges, sheetSize, squeeze) => {
    if (!navigator.onLine) return { mappedPoints: [], axisLines: [] };
    if (validPoints.length === 0) return { mappedPoints: [], axisLines: [] };

    const { minX, maxX, minY, maxY } = ranges;
    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    const drawingWidth = sheetSize.x - 2 * squeeze.x;
    const drawingHeight = sheetSize.y - 2 * squeeze.y;

    // Mapping functions
    const mapX = (val) => (val - minX) * drawingWidth / xRange + squeeze.x;
    const mapY = (val) => (val - minY) * drawingHeight / yRange + squeeze.y;

    const mappedPoints = validPoints.map(point => ({
        x: mapX(point.x),
        y: mapY(point.y),
        originalX: point.x,
        originalY: point.y
    }));

    const axisLines = [];

    // Add Y-Axis (where X=0) if 0 is in X range
    if (minX <= 0 && maxX >= 0) {
        const physX0 = mapX(0);
        axisLines.push({
            label: `y axis (${physX0.toFixed(1)}mm)`,
            data: [{ x: physX0, y: 0 }, { x: physX0, y: sheetSize.y }],
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            showLine: true,
            pointRadius: 0,
            type: 'scatter'
        });
    }

    // Add X-Axis (where Y=0) if 0 is in Y range
    if (minY <= 0 && maxY >= 0) {
        const physY0 = mapY(0);
        axisLines.push({
            label: `x axis (${physY0.toFixed(1)}mm)`,
            data: [{ x: 0, y: physY0 }, { x: sheetSize.x, y: physY0 }],
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            showLine: true,
            pointRadius: 0,
            type: 'scatter'
        });
    }

    return { mappedPoints, axisLines };
};
