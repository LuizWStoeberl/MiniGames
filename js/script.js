const canvas = document.getElementById("meuCanvas");
const  ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2;
const raio = 30;
const velocidade = 5;

const teclas = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

document.addEventListener("keydown", (e) =>  {
    if (e.key in teclas) teclas[e.key] = true;
});

document.addEventListener("keyup", (e) =>{
    if (e.key in teclas) teclas[e.key] = false;
});

function atualizar() {
    if(teclas.ArrowUp) y -= velocidade;
    if(teclas.ArrowDown) y += velocidade;
    if(teclas.ArrowLeft) x -= velocidade;
    if(teclas.ArrowRight) x += velocidade;

    x = Math.max(raio, Math.min(canvas.width - raio, x));
    y = Math.max(raio, Math.min(canvas.height - raio, y));
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();