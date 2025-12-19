/**
 * Chart Tick Utilities
 * Handles tick value calculations and formatting
 */

/**
 * Calculate the data value at a given mm position on the chart
 * Formula: (min - squeeze/scale) + mmPos * scale
 */
export const calculateTickValue = (mmPos, minValue, squeeze, unitsPerMm) => {
    return (minValue - squeeze * unitsPerMm) + mmPos * unitsPerMm;
};

/**
 * 
 * Split a number into scientific notation parts
 */
export const getScientificParts = (value) => {
    if (!value && value !== 0) return { mantissa: '0', exponent: 0 };
    if (value === 0) return { mantissa: '0', exponent: 0 };

    const absNum = Math.abs(value);
    const integerDigits = Math.floor(Math.log10(absNum)) + 1;

    // Determine the appropriate exponent (multiple of 3)
    let exponent;
    if (absNum < 1 && absNum > 0) {
        // Handle small numbers
        exponent = Math.floor(Math.log10(absNum) / 3) * 3;
    } else if (integerDigits <= 3) {
        exponent = 0;
    } else {
        // For large numbers, use the closest multiple of 3
        exponent = Math.floor((integerDigits - 1) / 3) * 3;
    }

    const mantissa = value / Math.pow(10, exponent);

    return {
        mantissa: Number.isInteger(mantissa) ? mantissa.toString() : mantissa.toFixed(4),
        exponent
    };
};

/**
 * Calculate the common exponent for a range of values
 */
export const calculateCommonExponent = (min, max) => {
    const maxAbs = Math.max(Math.abs(min), Math.abs(max));
    if (maxAbs === 0) return 0;

    const { exponent } = getScientificParts(maxAbs);
    return exponent;
};

/**
 * Format tick label for display (mm value with scientific notation)
 */
export const formatTickLabel = (mmValue, dataValue, formatScientific, commonExponent = 0) => {
    let formattedValue;
    if (commonExponent !== 0) {
        const scaledValue = dataValue / Math.pow(10, commonExponent);
        formattedValue = scaledValue.toFixed(4);
    } else {
        formattedValue = formatScientific(dataValue);
    }
    const formattedMmValue = +Number(mmValue).toFixed(1);
    const mmSuffix = formattedMmValue === 0 ? '(mm)' : '';
    return `${formattedValue} | ${formattedMmValue}${mmSuffix}`;
};

/**
 * Create tick callback function for axis
 */
export const createTickCallback = (ranges, squeeze, unitsPerMm, axis, formatScientific, commonExponent = 0) => {
    const minValue = axis === 'x' ? ranges.minX : ranges.minY;
    const squeezeValue = axis === 'x' ? squeeze.x : squeeze.y;
    const scale = axis === 'x' ? unitsPerMm.x : unitsPerMm.y;

    return function (value) {
        const tickValue = calculateTickValue(value, minValue, squeezeValue, scale);
        return formatTickLabel(value, tickValue, formatScientific, commonExponent);
    };
};
