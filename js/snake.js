const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

let jogoIniciado = false;
let jogoRodando = false;

const CobraRaio = 30;
const ComidaRaio = 15;
const InimigoRaio = 20;
let velocidade = 5;

let cobra = [{ x: 100, y: 100 }];
let xComida = Math.random() * canvas.width;
let yComida = Math.random() * canvas.height;

let inimigos = [];
let tamanho = 0;
let nivel = 1;

// controles
const teclas = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

// Eventos
document.addEventListener("keydown", (e) => {
    if (e.key in teclas) teclas[e.key] = true;

    // Espaço inicia ou retoma
    if (e.code === "Space") {
        if (!jogoIniciado) {
            iniciarJogo(); // inicia pela primeira vez
        } else if (!jogoRodando) {
            jogoRodando = true; // retoma do pause
        }
    }

    // ESC alterna pausa
    if (e.code === "Escape" && jogoIniciado) {
        jogoRodando = !jogoRodando;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key in teclas) teclas[e.key] = false;
});

document.addEventListener("keyup", (e) => {
    if (e.key in teclas) teclas[e.key] = false;
});

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", iniciarJogo);
startBtn.addEventListener("keypress", (e) => { if(e.code === "Space") iniciarJogo(); });

// funções
function iniciarJogo() {
    jogoRodando = true;
    jogoIniciado = true;
    startBtn.style.display = "none";
    if(inimigos.length === 0) criarInimigo();
}

function resetarBola() {
    xComida = Math.random() * canvas.width;
    yComida = Math.random() * canvas.height;
}

function adicionarCobra() {
    let ultimo = cobra[cobra.length - 1];
    cobra.push({ x: ultimo.x, y: ultimo.y });
}

function criarInimigo() {
    inimigos.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

function resetarInimigos() {
    for (let i = 0; i < inimigos.length; i++) {
        inimigos[i].x = Math.random() * canvas.width;
        inimigos[i].y = Math.random() * canvas.height;
    }
}

function endGame() {
    cobra = [{ x: 100, y: 100 }];
    tamanho = 0;
    nivel = 1;
    inimigos = [];
    jogoIniciado = false;
    jogoRodando = false;
    startBtn.style.display = "block";
}

function atualizar() {
    if(!jogoRodando) return;

    // mover corpo da cobra
    for (let i = cobra.length - 1; i > 0; i--) {
        cobra[i].x = cobra[i - 1].x;
        cobra[i].y = cobra[i - 1].y;
    }

    // mover cabeça
    if(teclas.ArrowLeft) cobra[0].x -= velocidade;
    if(teclas.ArrowRight) cobra[0].x += velocidade;
    if(teclas.ArrowUp) cobra[0].y -= velocidade;
    if(teclas.ArrowDown) cobra[0].y += velocidade;

    // limitar no canvas
    cobra[0].x = Math.max(CobraRaio, Math.min(canvas.width - CobraRaio, cobra[0].x));
    cobra[0].y = Math.max(CobraRaio, Math.min(canvas.height - CobraRaio, cobra[0].y));

    // colisão com comida
    let dx = cobra[0].x - xComida;
    let dy = cobra[0].y - yComida;
    if(Math.sqrt(dx*dx + dy*dy) < CobraRaio + ComidaRaio) {
        adicionarCobra();
        resetarBola();
        resetarInimigos();
        tamanho++;

        // sobe de nível a cada 5 comidas
        if(tamanho >= 5) {
            tamanho = 0;
            nivel++;
            criarInimigo();
        }
    }

    // colisão com inimigos
    for (let inimigo of inimigos) {
        let ix = cobra[0].x - inimigo.x;
        let iy = cobra[0].y - inimigo.y;
        if(Math.sqrt(ix*ix + iy*iy) < CobraRaio + InimigoRaio) {
            endGame();
        }
    }
}

let mostrarTexto = true;
setInterval(() => { mostrarTexto = !mostrarTexto; }, 500);

function desenharTexto() {
    if(!jogoRodando && !jogoIniciado && mostrarTexto) {
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Aperte Espaço', 250, canvas.height / 2);
    }

    if(!jogoRodando && jogoIniciado) {
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Jogo Pausado', 250, canvas.height / 2);
    }
}

function desenhar() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // HUD
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Tamanho: ${tamanho} | Nível: ${nivel}`, 20, 30);

    // cobra
    ctx.fillStyle = "red";
    for(let parte of cobra) {
        ctx.beginPath();
        ctx.arc(parte.x, parte.y, CobraRaio, 0, Math.PI*2);
        ctx.fill();
    }

    // comida
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(xComida, yComida, ComidaRaio, 0, Math.PI*2);
    ctx.fill();

    // inimigos
    ctx.fillStyle = "green";
    for(let inimigo of inimigos) {
        ctx.beginPath();
        ctx.arc(inimigo.x, inimigo.y, InimigoRaio, 0, Math.PI*2);
        ctx.fill();
    }

    desenharTexto();
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();