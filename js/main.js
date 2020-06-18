let stack = {
    el: null,
    items: null,
    total: 0,
    speed: 0,
    current: 1
}

let debug = {}
let lastTouchY = 0;

function updateDebug() {
    debug.current.textContent = `Current: ${stack.current}`;
    debug.speed.textContent = `Speed: ${stack.speed}`;
    debug.delay.textContent = `Delay: ${stack.delay}ms`;
}

function updateStack(offset) {
    if (stack.speed !== 0) {
        let prev = parseInt(stack.el.getAttribute('data-current'))
        let current = prev + offset;
        if (current <= stack.total && current >= 1) {
            stack.current = current;
        } else if (current < 1) {
            stack.current = stack.total;
        } else if (current > stack.total) {
            stack.current = 1;
        }
        stack.el.setAttribute('data-current', stack.current)
        updateDebug()
    }
}

function handleTouchStart(e) {
    lastTouchY = e.touches[0].clientY;
}
function handleTouchEnd(e) {
    lastTouchY = 0;
}
function handleTouchCancel(e) { }
function handleTouchMove(e) {
    const touch = e.changedTouches[0];
    const deltaY = lastTouchY - touch.clientY;
    let offset = 0;
    if (deltaY > 0) {
        stack.speed += 1;
    } else {
        stack.speed -= 1;
    }
    updateDebug()
}

function stackLoop() {
    let offset = 1;
    if (stack.speed < 0) {
        offset = -1;
    }
    updateStack(offset)
    window.setTimeout(stackLoop, stack.delay)
}

window.addEventListener('DOMContentLoaded', () => {
    debug.current = document.querySelector('#debug-current')
    debug.speed = document.querySelector('#debug-speed')
    debug.delay = document.querySelector('#debug-delay')
    stack.el = document.querySelector('.stack')
    stack.items = document.querySelectorAll('.stack img')
    stack.total = stack.items.length;

    updateDebug();

    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchend", handleTouchEnd, false);
    window.addEventListener("touchcancel", handleTouchCancel, false);
    window.addEventListener("touchmove", handleTouchMove, false);

    stackLoop();

    window.addEventListener('wheel', e => {
        e.preventDefault()
        if (e.deltaY > 0) {
            stack.speed -= 1;
        } else {
            stack.speed += 1;
        }
        if (stack.speed > 10){
            stack.speed = 10;
        }
        if (stack.speed < -10){
            stack.speed = -10;
        }

        stack.delay = Math.abs((800 - Math.abs((stack.speed * 80))) + 70);
        updateDebug()
    });
})