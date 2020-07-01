// rounds to nearest 16
function roundToGrid(number) {
    return Math.round(number / 16) * 16;
}

// clamps a value between min and max
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// linear interpolation towards somewhere
function lerp(start, end, amt) { return (1 - amt) * start + amt * end; }

// returns a new value with friction applied
function friction(value, amount) {
    if (value > 0) { value -= amount; }
    if (value < 0) { value += amount; }
    if (Math.abs(value) < amount * 2) { value = 0; }
    return value;
}

const tau = Math.PI * 2;
const pi = Math.PI;
const halfPI = pi/2;
// returns a new angle that gets closer to the target angle
function turn(cur, target, speed) {
    if (target < 0) { target = tau + target; }
    if ((cur % tau) > target) {
        if ((cur % tau) - target > pi) {
            cur += speed;
        } else {
            cur -= speed;
        }
    } else {
        if (target - (cur % tau) > pi) {
            cur -= speed;
        } else {
            cur += speed;
        }
    }
    if (Math.abs(cur - target) < speed * 1.1) {
        cur = target;
    }
    if (cur > tau) { cur = cur - tau; }
    if (cur < 0) { cur = tau + cur; }
    return cur;
}

// maps one range of values to another
function mapRange(value, valueLow, valueHigh, remappedLow, remappedHigh) {
    return remappedLow + (remappedHigh - remappedLow) * (value - valueLow) / (valueHigh - valueLow);
}