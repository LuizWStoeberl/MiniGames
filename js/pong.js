const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2;
const velocidade = 30;

const teclas = {
    ArrowLeft: false,
    ArrowRight: false,
};

document.addEventListener("keydown", (e) => {
    if (e.key in teclas) teclas[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key in teclas) teclas[e.key] = false;
});

function atualizar() {
    if (teclas.ArrowLeft) x -= velocidade;
    if (teclas.ArrowRight) x += velocidade;
}

function desenhar() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(325, 700, 150, 20);
    ctx.fill();
    

    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.rect(325,100,150,20);
    ctx.fill();
    

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill()
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();
