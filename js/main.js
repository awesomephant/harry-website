let stack = {
    el: null,
    items: null,
    total: 0,
    speed: 0,
    current: 1,
    delay: 0
}
let graph = {
    el: null,
    values: [],
    resX: 150,
}
let logo = {
    el: null,
    x: 10,
    y: 10,
    w: 0,
    h: 0,
    vx: 1,
    vy: 1,
    vxSign: 1,
    vySign: 1
}
let running = true;
let debug = {}
let lastTouchY = 0;

function updateLogo() {
    logo.x += logo.vx * logo.vxSign
    logo.y += logo.vy * logo.vySign

    if ((logo.x + logo.w) > window.innerWidth) {
        logo.x = window.innerWidth - logo.w;
        logo.vxSign *= -1;
    }
    if (logo.x < 0) {
        logo.x = 0;
        logo.vxSign *= -1;
    }

    if (logo.y + logo.h > window.innerHeight) {
        logo.y = window.innerHeight - logo.h;
        logo.vySign *= -1;
    }
    if (logo.y < 0) {
        logo.y = 0;
        logo.vySign *= -1;
    }

    logo.el.style.transform = `translateX(${logo.x}px) translateY(${logo.y}px)`
}

function drawGraph() {
    function scaleX(value) {
        return ((graph.el.canvas.width / graph.resX) * value)
    }
    function scaleY(value) {
        const range = 20;
        return (graph.el.canvas.height / 2) + (((graph.el.canvas.height - 10) / range) * -1 * value)
    }
    graph.values.push(stack.speed)

    if (graph.values.length > graph.resX) {
        graph.values.shift()
    }

    graph.el.clearRect(0, 0, graph.el.canvas.width, graph.el.canvas.height)

    graph.el.strokeStyle = 'gray'
    graph.el.lineWidth = '1'
    graph.el.beginPath();
    graph.el.moveTo(0, scaleY(0));
    graph.el.lineTo(graph.el.canvas.width, scaleY(0));
    graph.el.stroke();

    graph.el.strokeStyle = 'white'
    graph.el.lineWidth = '2'
    graph.el.beginPath();
    graph.el.moveTo(0, scaleY(graph.values[0]));

    for (let i = 1; i < graph.values.length; i++) {
        const v = graph.values[i]
        let x = scaleX(i)
        graph.el.lineTo(x, scaleY(v));
    }
    graph.el.stroke();
}

function graphLoop() {
    drawGraph()
    updateLogo()
    window.requestAnimationFrame(graphLoop)
}

function updateDebug() {
    debug.current.textContent = `Frame: ${stack.current}/${stack.total}`;
    debug.speed.textContent = `Speed: ${stack.speed}`;
    if (stack.delay === 0) {
        debug.delay.textContent = `Delay: n/a`;
    } else {
        debug.delay.textContent = `Delay: ${stack.delay}ms`;
    }
    logo.vx = stack.speed;
    logo.vy = stack.speed;

    if (stack.current === stack.total) {

    }
}

function updateStack(offset) {
    if (stack.speed !== 0) {
        let prev = parseInt(stack.el.getAttribute('data-current'))
        let current = prev + offset;
        if (current <= stack.total && current >= 1) {
            stack.current = current;
        } else if (current < 1) {
            stack.current = 1;
            stack.speed = 0;
        } else if (current > stack.total - 1) {
            stack.el.setAttribute('data-current', stack.total)
            stack.speed = 0;
            running = false;
            window.setTimeout(function () {
                window.location = 'https://www.google.com/';
            }, 1000)
        }
        stack.el.setAttribute('data-current', stack.current)
        updateDebug()
    }
}

function handleTouchStart(e) {
    lastTouchY = e.touches[0].clientY;
    console.log(e)
}
function handleTouchEnd(e) {
    lastTouchY = 0;
}
function handleTouchCancel(e) { }
function handleTouchMove(e) {
    const touch = e.changedTouches[0];
    let s = Math.round(20 * ((window.innerHeight / 2) - Math.round(touch.clientY)) / window.innerHeight);
    stack.speed = s;
    stack.delay = Math.abs((800 - Math.abs((stack.speed * 80))) + 70);
    updateDebug()
}

function stackLoop() {
    if (running) {
        let offset = 1;
        if (stack.speed < 0) {
            offset = -1;
        }
        updateStack(offset)
        window.setTimeout(stackLoop, stack.delay)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    debug.current = document.querySelector('#debug-current')
    debug.speed = document.querySelector('#debug-speed')
    debug.delay = document.querySelector('#debug-delay')
    stack.el = document.querySelector('.stack')
    stack.items = document.querySelectorAll('.stack img')
    let ge = document.querySelector('#graph')
    graph.el = ge.getContext('2d');
    stack.total = stack.items.length;

    logo.el = document.querySelector('.site-title')
    let box = logo.el.getBoundingClientRect();
    logo.w = box.width;
    logo.h = box.height;


    updateDebug();
    graphLoop();

    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchend", handleTouchEnd, false);
    window.addEventListener("touchcancel", handleTouchCancel, false);
    window.addEventListener("touchmove", handleTouchMove, false);

    stackLoop();

    window.addEventListener('wheel', e => {
        e.preventDefault()
        if (e.deltaY > 0 && stack.current > 1) {
            stack.speed -= 1;
        } else if (e.deltaY < 0) {
            stack.speed += 1;
        }
        if (stack.speed > 10) {
            stack.speed = 10;
        }
        if (stack.speed < -10) {
            stack.speed = -10;
        }

        stack.delay = Math.abs((800 - Math.abs((stack.speed * 80))) + 70);
        updateDebug()
    });
})