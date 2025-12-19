/**
 * Chart Axis Configuration
 * Handles complete axis configuration including scales, ticks, and titles
 */

import { createGridConfig } from './chartGridConfig';

import { createTickCallback, getScientificParts, calculateCommonExponent } from './chartTickUtils';

/**
 * Create X axis configuration
 */
export const createXAxisConfig = ({
    sheetSize,
    ranges,
    squeeze,
    unitsPerMm,
    show10mmMarkers,
    formatScientific,
    tickLabelMode = 'all',
    tickCounts = { x: 5, y: 5 }
}) => {
    const commonExponent = calculateCommonExponent(ranges.minX, ranges.maxX);
    let titleText = 'X Parameter';
    if (commonExponent !== 0) {
        const suffix = commonExponent > 0
            ? `/ 10^${commonExponent}`
            : `* 10^${-commonExponent}`;
        titleText = `X Parameter ${suffix}`;
    }

    // Determine step size based on mode
    let stepSize = 10;
    let displayTicks = true;

    if (tickLabelMode === 'none') {
        displayTicks = false;
    } else if (tickLabelMode === 'interval') {
        // Calculate step size to get roughly tickCounts.x ticks
        // We use the sheet size (max) to determine the interval
        stepSize = sheetSize.x / Math.max(1, tickCounts.x);
    }

    return {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: sheetSize.x,
        grid: createGridConfig(show10mmMarkers),
        ticks: {
            display: displayTicks,
            color: '#a0a8c0',
            stepSize: stepSize,
            font: { family: 'Inter', size: 11 },
            callback: createTickCallback(ranges, squeeze, unitsPerMm, 'x', formatScientific, commonExponent)
        },
        title: {
            display: true,
            text: titleText,
            color: '#e4e7f1',
            font: { family: 'Inter', size: 13, weight: '600' },
        },
    };
};

/**
 * Create Y axis configuration
 */
export const createYAxisConfig = ({
    sheetSize,
    ranges,
    squeeze,
    unitsPerMm,
    show10mmMarkers,
    formatScientific,
    tickLabelMode = 'all',
    tickCounts = { x: 5, y: 5 }
}) => {
    const commonExponent = calculateCommonExponent(ranges.minY, ranges.maxY);
    let titleText = 'Y Parameter';
    if (commonExponent !== 0) {
        const suffix = commonExponent > 0
            ? `/ 10^${commonExponent}`
            : `* 10^${-commonExponent}`;
        titleText = `Y Parameter ${suffix}`;
    }

    // Determine step size based on mode
    let stepSize = 10;
    let displayTicks = true;

    if (tickLabelMode === 'none') {
        displayTicks = false;
    } else if (tickLabelMode === 'interval') {
        stepSize = sheetSize.y / Math.max(1, tickCounts.y);
    }

    return {
        type: 'linear',
        min: 0,
        max: sheetSize.y,
        grid: createGridConfig(show10mmMarkers),
        ticks: {
            display: displayTicks,
            color: '#a0a8c0',
            stepSize: stepSize,
            font: { family: 'Inter', size: 11 },
            callback: createTickCallback(ranges, squeeze, unitsPerMm, 'y', formatScientific, commonExponent)
        },
        title: {
            display: true,
            text: titleText,
            color: '#e4e7f1',
            font: { family: 'Inter', size: 13, weight: '600' },
        },
    };
};
