
function Solve(val) {
    var v = document.getElementById('res');
    var currentVal = v.value;
    var lastChar = currentVal.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];

    if (operators.includes(val)) {
        if (currentVal === '') {
            if (val === '-') {
                v.value += val;
            }
            return;
        }
        if (operators.includes(lastChar)) {
            v.value = currentVal.slice(0, -1) + val;
        } else {
            v.value += val;
        }
    } else if (val === '.') {
        const parts = currentVal.split(/[\+\-\*\/%]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes('.')) {
            return;
        } else {
            v.value += val;
        }
    } else {
        v.value += val;
    }
}

function Result() {
    var num1 = document.getElementById('res').value;
    const operators = ['+', '-', '*', '/', '%'];
    var lastChar = num1.slice(-1);

    
    if (num1 === '1+') {
        document.getElementById('res').value = 'Oneplus';
        return; 
    }
    

    if (num1 === '') {
        document.getElementById('res').value = 'Error';
        return;
    }
    if (operators.includes(lastChar)) {
        if (num1 !== '-') {
            document.getElementById('res').value = 'Error';
            return;
        }
    }

    try {
        let expression = num1.replace(/x/g, '*');
        if (expression.match(/[\+\-\*\/%]{2,}/)) {
            document.getElementById('res').value = 'Error';
            return;
        }
        var num2 = eval(expression);
        document.getElementById('res').value = num2;
    } catch (e) {
        document.getElementById('res').value = 'Error';
    }
}

function Clear() {
    var inp = document.getElementById('res');
    inp.value = '';
}
function Back() {
    var ev = document.getElementById('res');
    ev.value = ev.value.slice(0, -1);
}
document.addEventListener('keydown', function (event) {
    const key = event.key;
    let mappedKey = key;
    if (key === 'Enter') {
        event.preventDefault();
        Result();
        return;
    } else if (key === 'Backspace') {
        event.preventDefault();
        Back();
        return;
    } else if (key.toLowerCase() === 'c') {
        Clear();
        return;
    } else if (key === '*') {
        mappedKey = 'x';
    } else if (key === '/') {
        mappedKey = '/';
    } else if (key === '-') {
        mappedKey = '-';
    } else if (key === '+') {
        mappedKey = '+';
    } else if (key === '%') {
        mappedKey = '%';
    } else if (key === '.') {
        mappedKey = '.';
    } else if (key >= '0' && key <= '9') {
        mappedKey = key;
    } else {
        return;
    }
    Solve(mappedKey);
});


function startCalculatorReveal() {
    const calculator = document.getElementById('calc');
    calculator.classList.add('hidden');
    setTimeout(() => {
        calculator.classList.remove('hidden');
        calculator.classList.add('calculator-fade-in');
    }, 50);
}


const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
let mouse = { x: undefined, y: undefined };
const maxDistance = 150; 
const dotSpacing = 30; 
const baseRadius = 1.5; 
const glowColor = 'rgba(100, 100, 255, 0.7)';
const defaultColor = 'rgba(50, 50, 50, 0.7)';


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots(); 


function Dot(x, y) {
    this.x = x;
    this.y = y;
    this.baseRadius = baseRadius;
    this.radius = this.baseRadius;
    this.color = defaultColor;
    this.opacity = 0.5;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 2;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    this.update = function() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

       
        if (distance < maxDistance) {
            let scale = 1 - (distance / maxDistance);
           
            this.radius = this.baseRadius + (this.baseRadius * 1.2 * scale); 
            this.color = glowColor;
            this.opacity = 0.5 + (0.5 * scale);
        } else {
            this.radius = this.baseRadius;
            this.color = defaultColor;
            this.opacity = 0.5;
        }
        this.draw();
    };
}


function initDots() {
    dots = [];
    const numCols = Math.floor(canvas.width / dotSpacing);
    const numRows = Math.floor(canvas.height / dotSpacing);

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            let x = i * dotSpacing + dotSpacing / 2;
            let y = j * dotSpacing + dotSpacing / 2;
            dots.push(new Dot(x, y));
        }
    }
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.length; i++) {
        dots[i].update();
    }
}


window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
canvas.addEventListener('mouseleave', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});


resizeCanvas();
animate();
