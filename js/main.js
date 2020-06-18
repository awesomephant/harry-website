let stack = {
    el: null,
    items: null,
    total: 0,
    current: 0
}

let debug = {}

function updateDebug() {
    debug.current.textContent = `Current: ${stack.current}`;
}

function updateStack(offset) {
    let prev = parseInt(stack.el.getAttribute('data-current'))
    let current = prev + offset;
    if (current < stack.total && current > 0) {
        stack.current = current;
        stack.el.setAttribute('data-current', stack.current)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    debug.current = document.querySelector('#debug-current')
    debug.offset = document.querySelector('#debug-offset')
    stack.el = document.querySelector('.stack')
    stack.items = document.querySelectorAll('.stack img')
    stack.total = stack.items.length;

    updateDebug();

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