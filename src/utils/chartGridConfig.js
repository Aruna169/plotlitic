/**
 * Chart Grid Configuration
 * Handles grid line colors, widths, and tick line styling
 */

/**
 * Create grid configuration object
 * @param {boolean} show10mmMarkers - Whether to show 10mm grid lines
 * @returns {object} Grid configuration for Chart.js
 */
export const createGridConfig = (show10mmMarkers) => {
    return {
        display: true,
        drawTicks: true,
        tickColor: 'rgba(121, 120, 155, 0.29)', // Tick line color
        color: function (context) {
            if (!show10mmMarkers) {
                return 'transparent';
            }
            const value = context.tick.value;
            // 50 lines opacity (70%)
            if (value % 50 === 0) {
                return 'rgba(149, 150, 206, 0.2)';
            }
            // Gridline opacity - 10mm lines (60%)
            if (value % 10 === 0) {
                return 'rgba(185, 186, 222, 0.1)';
            }
            return 'transparent';
        },
        lineWidth: function (context) {
            const value = context.tick.value;
            if (value % 50 === 0) return 2;
            if (value % 10 === 0) return 1;
            return 0;
        },
    };
};
