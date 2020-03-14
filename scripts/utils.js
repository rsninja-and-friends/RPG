function roundToGrid(number) {
    return Math.round(number / 16) * 16;
}
function clamp(value,min,max) {
    return Math.min(max,Math.max(min,value));
}