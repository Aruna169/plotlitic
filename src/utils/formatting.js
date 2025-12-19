export const formatScientific = (num) => {
    if (!num && num !== 0) return '0';
    if (num === 0) return '0';

    const absNum = Math.abs(num);
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

    const mantissa = num / Math.pow(10, exponent);

    // Format mantissa to reasonable precision
    const formattedMantissa = mantissa.toFixed(4);

    if (exponent === 0) return formattedMantissa.toString();
    return `${formattedMantissa}*10^${exponent}`;
};
