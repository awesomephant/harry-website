let stack = {
    el: null,
    items: null,
    total: 0,
    current: 0
}

let debug = {}
let lastTouchY = 0;

function updateDebug() {
    debug.current.textContent = `Current: ${stack.current}`;
}

function updateStack(offset) {
    console.log('going to ' + offset)
    let prev = parseInt(stack.el.getAttribute('data-current'))
    let current = prev + offset;
    if (current < stack.total && current > 0) {
        stack.current = current;
        stack.el.setAttribute('data-current', stack.current)
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
        offset = 1;
    } else {
        offset = -1
    }
    updateStack(offset)
    updateDebug()
}

window.addEventListener('DOMContentLoaded', () => {
    debug.current = document.querySelector('#debug-current')
    debug.offset = document.querySelector('#debug-offset')
    stack.el = document.querySelector('.stack')
    stack.items = document.querySelectorAll('.stack img')
    stack.total = stack.items.length;

    updateDebug();

    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchend", handleTouchEnd, false);
    window.addEventListener("touchcancel", handleTouchCancel, false);
    window.addEventListener("touchmove", handleTouchMove, false);

    window.addEventListener('wheel', e => {
        e.preventDefault()
        let offset = 0;
        if (e.deltaY > 0) {
            offset = 1;
        } else {
            offset = -1
        }
        updateStack(offset)
        updateDebug()
    });
})