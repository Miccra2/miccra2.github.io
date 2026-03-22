const time     = document.getElementById("time-data");
const question = document.getElementById("question");
const answer   = document.getElementById("answer");

function RandInt(max) {
    return Math.floor(Math.random() * max);
}

let IOTA_COUNTER = 0;
function iota(offset) {
    if (typeof offset === "number") {
        IOTA_COUNTER = offset
    }
    return IOTA_COUNTER++;
}

const ExprKind = {
    addition:       iota(0),
    subtraction:    iota(),
    mulitplication: iota(),
    division:       iota(),
};

const ExprGen = {
    ops: [
        ExprKind.addition, 
        ExprKind.subtraction, 
        ExprKind.multiplication, 
        //ExprKind.division,
    ],
    count: 1,
    min:   1,
    max:   10,
};

function GenerateExpression() {
    let range = (a, b) => { return RandInt(b - a) + a; }
    let _expr = range(ExprGen.min, ExprGen.max);
    for (let i = 0; i < ExprGen.count; i++) {
        _expr = [
            ExprGen.ops[RandInt(ExprGen.ops.length)], 
            _expr, 
            range(ExprGen.min, ExprGen.max)
        ];
    }
    return _expr;
    }

function WalkStack(e) {
    stack.push(e);
    while (typeof stack[stack.length - 1][1] !== 'number') {
        stack.push(e[1]);
    }
}

let _time;
let expr;
let stack = [];
function NewQuestion() {
    expr = GenerateExpression();
    WalkStack(expr);
    let buf = stack[stack.length - 1][1].toString();
    while (stack.length > 0) {
        let _expr = stack.pop();
        switch (_expr[0]) {
        case ExprKind.addition:      buf += " + " + _expr[2].toString(); break;
        case ExprKind.subtraction:   buf += " - " + _expr[2].toString(); break;
        case ExprKind.mltiplication: buf += " * " + _expr[2].toString(); break;
        case ExprKind.division:      buf += " / " + _expr[2].toString(); break;
        default: console.log("unsupported ExprKind ", _expr[0]);
        }
    }
    question.innerText = buf;
    _time = Date.now();
}

function getPrecedence(kind) {
    switch (kind) {
    case ExprKind.addition:       case ExprKind.subtraction: return 1;
    case ExprKind.multiplication: case ExprKind.division:    return 2;
    default:                                                 return 0;
    }
}

function EvalExpr(e) {
    stack = [];
    stack.push(e);
    let buf = stack[stack.length - 1][1];
    while (stack.length > 0) {
        let _expr = stack.pop();
        switch (_expr[0]) {
        case ExprKind.addition:       buf += _expr[2]; break;
        case ExprKind.subtraction:    buf -= _expr[2]; break;
        case ExprKind.multiplication: buf *= _expr[2]; break;
        case ExprKind.division:       buf /= _expr[2]; break;
        default: console.log("unsupported ExprKind ", expr[0]); return [false, undefined]
        }
    }
    return [true, buf];
}

NewQuestion();
document.addEventListener("keydown", (e) => {
    switch (e.key) {
    case "Delete":
    case "Backspace":
        answer.innerText = answer.innerText.substring(0, answer.innerText.length - 1);
        break;
    case "Enter":
        let eval = EvalExpr(expr);
        if (eval[0] && eval[1].toString() === answer.innerText) {
            const dt = (Date.now() - _time) / 1000;
            time.innerText = `${dt}s`;
            NewQuestion();
            answer.style.background = "#008800";
        } else {
            answer.style.background = "#880000";
        }
        answer.innerText = "";
        break;
    case '-': case '.': case '0': case '1': case '2': case '3':
    case '4': case '5': case '6': case '7': case '8': case '9':
        answer.innerText += e.key; break;
    default: console.log("Invalid Key key=", e.key, "code=", e.code);
    }
});
