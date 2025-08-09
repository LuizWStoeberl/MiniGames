const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Bola
let xBola = canvas.width / 2;
let yBola = canvas.height / 2;
let raioBola = 10;
let velBolaX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 4 + 2);
let velBolaY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 4 + 2);
let aceleracao = 1.05;
let velMax = 12;

// Placa 
let placarPlayer = 0;
let placarEnemy = 0;

// Jogador
let plataformaX = 325;
let plataformaY = 700;
const plataformaLargura = 150;
const plataformaAltura = 20;

// Inimigo
let roxaX = 325;
let roxaY = 100;
const roxaLargura = 150;
const roxaAltura = 20;

const velocidade = 10;
const velocidadeRoxa = 3;
const margemErro = 15;

// Jogo rodando 
let jogoRodando = false;
const startBtn = document.getElementById("startBtn");

// Teclado
const teclas = { ArrowLeft: false, ArrowRight: false, VideoColorSpace: false };

document.addEventListener("keydown", (e) => {
    if (e.key in teclas) teclas[e.key] = true;

    if (e.code === "Space" && !jogoRodando) {
        iniciarJogo();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key in teclas) teclas[e.key] = false;
});


// Botão start
startBtn.addEventListener("keypress", iniciarJogo);

function iniciarJogo() {
    velBolaX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 4 + 2);
    velBolaY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 4 + 2);
    jogoRodando = true;
    startBtn.style.display = "none";
}

function reiniciarJogo() {
    placarEnemy = 0;
    placarPlayer = 0;
    resetarBola();
    resetarPlataformaEnemy();
    resetarPlataformaPlayer();
}

function resetarBola() {
    xBola = canvas.width / 2;
    yBola = canvas.height / 2;
    jogoRodando = false;
    startBtn.style.display = "block";
}

function resetarPlataformaPlayer() {
    plataformaX = 325;
    plataformaY = 700;
    jogoRodando = false;
    startBtn.style.display = "block"; 
}

function resetarPlataformaEnemy() {
    roxaX = 325;
    roxaY = 100;
    jogoRodando = false;
    startBtn.style.display = "block"; 
}

// Lógica funcional do jogo
function atualizar() {
    if (!jogoRodando) return;

    // Movimento da plataforma do jogador
    if (teclas.ArrowLeft) plataformaX -= velocidade;
    if (teclas.ArrowRight) plataformaX += velocidade;

    // Limite da plataforma na tela
    if (plataformaX < 0) plataformaX = 0;
    if (plataformaX + plataformaLargura > canvas.width) {
        plataformaX = canvas.width - plataformaLargura;
    }

    // IA
    let centroRoxa = roxaX + roxaLargura / 2;

    
    if (velBolaY < 0) {
        let distancia = xBola - centroRoxa;

        
        if (Math.abs(distancia) > margemErro) {
            
            if (distancia > 0) {
                roxaX += Math.min(distancia, velocidadeRoxa);
            } else {
                roxaX += Math.max(distancia, -velocidadeRoxa);
            }
        }
    }

    // Limitando inimigo
    if (roxaX < 0) roxaX = 0;
    if (roxaX + roxaLargura > canvas.width) {
        roxaX = canvas.width - roxaLargura;
    }

    // Movimento da bola
    xBola += velBolaX;
    yBola += velBolaY;

    // Colisão com paredes laterais
    if (xBola - raioBola < 0 || xBola + raioBola > canvas.width) {
        velBolaX *= -1;
    }

    // Colisão com teto (ponto para o jogador)
    if (yBola - raioBola < 0) {
        placarPlayer++;
        console.log("Player:", placarPlayer);
        resetarBola();
        resetarPlataformaEnemy();
        resetarPlataformaPlayer();
    }

    // Colisão com chão (ponto para inimigo)
    if (yBola + raioBola > canvas.height) {
        placarEnemy++;
        console.log("Enemy:", placarEnemy);
        resetarBola();
        resetarPlataformaEnemy();
        resetarPlataformaPlayer();
    }

    // Limitando o player
    if (
        velBolaY > 0 &&
        yBola + raioBola >= plataformaY &&
        yBola - raioBola <= plataformaY + plataformaAltura &&
        xBola >= plataformaX &&
        xBola <= plataformaX + plataformaLargura
    ) {
        let centro = plataformaX + plataformaLargura / 2;
        let dist = (xBola - centro) / (plataformaLargura / 2);
        velBolaX = dist * 5 + (Math.random() - 0.5) * 2;
        velBolaY = -Math.abs(velBolaY);
    }

    // Colisão com plataforma roxa (inimigo fixo)

    if (
        velBolaY < 0 &&
        yBola - raioBola <= roxaY + roxaAltura &&
        yBola + raioBola >= roxaY &&
        xBola >= roxaX &&
        xBola <= roxaX + roxaLargura
    ) {
        let centro = roxaX + roxaLargura / 2;
        let dist = (xBola - centro) / (roxaLargura / 2);
        velBolaX = dist * 5 + (Math.random() - 0.5) * 2;
        velBolaY = Math.abs(velBolaY);
    }

    if ( placarEnemy === 5 || placarPlayer === 5 ) {
        reiniciarJogo();
        console.log("Jogo acabou!");
    }
}


function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = "red";
    ctx.fillRect(plataformaX, plataformaY, plataformaLargura, plataformaAltura);

    
    ctx.fillStyle = "purple";
    ctx.fillRect(roxaX, roxaY, roxaLargura, roxaAltura);

    
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(xBola, yBola, raioBola, 0, Math.PI * 2);
    ctx.fill();

    
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Player: ${placarPlayer}`, 20, 30);
    ctx.fillText(`Enemy: ${placarEnemy}`, canvas.width - 120, 30);
}


function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();
