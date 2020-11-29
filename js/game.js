// Game setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context


canvas.width = innerWidth;
canvas.height = innerHeight;

const stats = $('#stats');
const scoreElement = $('#score');
const levelElement = $('#level');
const lastScoreElement = $('#lastScore');
const startGameBtn = $('.btn')[0];
const modalElement = $('#modal');
const propostasElement = $('#proposta');

const palavrasDiv = $('#palavras');
const playerElement = $("#player");
palavrasDiv.hide();
playerElement.hide();
stats.hide();

//modalElement.style.display = 'none !important';
//const modalElement = document.querySelector('#modal');


// Player
class Player {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        // this.image = new Image;
        // this.image.src = './assets/Rapaz parte de cima.png';
        // c.webkitImageSmoothingEnabled = false;
        // c.mozImageSmoothingEnabled = false;
        // c.msImageSmoothingEnabled = false;
        // c.imageSmoothingEnabled = false;
    }

    draw() {
        playerElement.show();
        playerElement[0].style.left = `${this.x}px`;
        playerElement[0].style.top = `${this.y+this.h/2}px`;
        
        // c.beginPath();
        // //c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.rect(this.x-this.w/2, this.y, this.w, this.h);
        // //c.drawImage(this.image, this.x-this.w/2, this.y, this.w, this.h);
        // c.strokeStyle = this.color;
        // c.stroke();
        // c.fillStyle = 'rgba(0,0,0,0)';
        // //c.fillStyle = this.color;
        // c.fill();
    }

    update(e) {
        if(e.targetTouches !== undefined ) {
            this.x = e.targetTouches[0].pageX;
        }
        
        if(e.clientX > this.w/2 && e.clientX < canvas.width - this.w/2 ) {
            this.x = e.clientX;  
        } 
    }
}

// Projectile
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.pastY = [];
        this.image = new Image;
        this.image.src = './assets/Logo 5.png';
        this.w = this.radius * 0.7
    }

    draw() {
        c.beginPath();

        let a = 0.7;
        for(let i=this.pastY.length; i>=0; i--) {
            if(a > 0) {
                var rgb = this.color.match(/\d+/g);
                let r = rgb[0];
                let g = rgb[1];
                let b = rgb[2];
                c.fillStyle = `rgba(${r},${g},${b}, ${a})`;
                c.arc(this.x, this.pastY[i], this.radius, 0, Math.PI*2, false); 
                a -= 0.08;
                c.fill();
            }
            else {
                this.pastY.splice(i, 1);
            }
        }
        c.closePath();

        c.beginPath();

        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();

        c.drawImage(this.image, this.x-this.w, this.y-this.w, this.w*2, this.w*2);
        // Create a trail effect
        c.closePath();
        
    }

    update() {
        this.draw();
        this.y = this.y - this.velocity;
        // Saves the last y position to create a trail effect
        this.pastY.push(this.y);
    }
}

// Enemy
class Enemy {
    constructor(x, y, radius, color, velocity, palavra) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.palavra = palavra;
        
        if(this.palavra != null) {
            this.id = palavra.replace(/[^a-zA-Z]+/g, '');
            palavrasDiv.append(`<span id="${this.id}" class="user-select-none m-0 p-0 text-light text-center palavra">${this.palavra}</span>`)
        } 
        else {
            this.id = null;
        }
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle =  this.color;//'rgba(255,255,255,10)'// //'rgba(0,0,0,0)';
        //c.strokeStyle = this.color;
        //c.stroke();
        c.fill();
        c.closePath();

        if(this.palavra != null) {
            let tag = `#${this.id}`;
            let w = parseFloat($(tag).css('width'));
            let h = parseFloat($(tag).css('height'));
            if($(tag)[0] != undefined){
                $(tag)[0].style.left = `${this.x-w/2}px`;
                $(tag)[0].style.top = `${this.y-h/2}px`;   
                // if(this.radius < 20) {   
                //     $(tag).remove();
                //     this.palavra = null;
                // }
                if(w > this.radius*2) {
                    $(tag).remove();
                    this.palavra = null;
                    this.id = null;
                }
            }
        }
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const friction = 0.99;
// Particle
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = (radius - 1) * Math.random() + 1;
        this.color = color;
        this.velocity = { 
            x: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0),
            y: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0)
        };
        this.alpha = 1;
        //this.pastXY = [];
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();

        // // Trail effect
        // let a = 0.7;
        // for(let i=this.pastXY.length-1; i>=0; i--) {
        //     if(a > 0) {
        //         let r = parseInt(this.color.slice(1, 3), 16);
        //         let g = parseInt(this.color.slice(3, 5), 16);
        //         let b = parseInt(this.color.slice(5, 7), 16);
        //         c.fillStyle = `rgba(${r},${g},${b}, ${a})`;
        //         c.arc(this.pastXY[i][0], this.pastXY[i][1], this.radius, 0, Math.PI*2, false); 
        //         a -= 0.08;
        //         c.fill();
        //     }
        //     else {
        //         this.pastXY.splice(i, 1);
        //     }
        // }
        c.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
        //this.pastXY.push([this.x, this.y]);
    }
}


// Player variables
let playerW = parseFloat(playerElement.css('width'));
let playerH = parseFloat(playerElement.css('height'));
let playerX = canvas.width/2;
let playerY = canvas.height - (playerH);
let playerColor = 'white';

// Projectile variables
let projectileRadius = 8;
//let projectileColor = 'rgb(150, 40, 40)';
let projectileColor = 'rgb(200, 220, 220)';
let projectileVelocity = 5;

// Particle variables
let numParticlesRatio = 2;
let particleRadius = 2;

// Game variables
let player = new Player(playerX, playerY, playerW, playerH, playerColor);
let projectiles = [];
let enemies = [];
let particles  = [];
let propostas = [
    'Exemplo proposta 1' , 
    'Exemplo proposta 2' , 
    'Exemplo proposta 3' , 
    'Exemplo proposta 4' ,
    'Exemplo proposta 5'
];

let propostasShuffled = shuffleArray(propostas);;
let propostasIndex = 0;
// First text always first
// propostasElement.html(propostas[propostasIndex]);

let palavras = [
    'PeliCuf' , 'LIA' , 'Workshops' , 'Palestras' , 'Research4U' , 'Proatividade' ,
    '+Estágios' , '+Congressos' , 'Piati' , '+Parcerias ' , 'Med On Tour' , 'Ser Abrigo' , 
    'B.A.' , 'Expansão' , 'Sunsets' , 'SCOPE' , 'SCORE' , 'PET/T4PE' , 
    'Erasmus+' , 'Buddy' , 'Quizzes' , 'Soft Skills' , 'Bolsas' , 'Literatura Ativa' , 
    'Vendas Online' , 'Camisolas SBV' , '+Representação' , 'SIGMA' , 'Sistema de Pontos' , 'APP AEFCM' , 
    'Proximidade' , 'COVID-19' , 'NMS Photography' , 'Podcast' , 'Desafios' , 'Concursos' , 
    'Stand Up' , 'Concertos' , 'Bares' , 'Discotecas' , 'Arraial' , 'Film Club' , 
    'Disponibilidade' , 'Caixa de Dúvidas' , 'SASNOVA' , 'Soft Skills' , 'Torneios' , 'Programação' , 
    'Workshops' , 'Apoio 24/7' , 'Parcerias Desporto' , 'Proximidade' , 'Transparência' , 'Debate' , 
];

let palavrasShuffled = shuffleArray(palavras);
let palavrasIndex = 0;


function initGame() {  
    player = new Player(playerX, playerY, playerW, playerH, playerColor);
    projectiles = [];
    enemies = [];
    particles  = [];
    score = 0;
    currentLevel = 1;
    levelElement.html(currentLevel);

    updateScore(scoreElement, 0);
    updateScore(lastScoreElement, 0);

    canvas.style.display = "";
    stats.show();
    palavrasDiv.show();
   
    propostasElement.html(propostasShuffled[propostasIndex]);
    // if(propostasIndex == 0) {
    //     //tirar link maybe
    // }
    propostasIndex++;
    if(propostasIndex == propostasShuffled.length) {
        propostasIndex = 0;
    }

    animate();
    
    updateEnemyInterval();

    modalElement.removeClass('d-flex');
    modalElement.addClass('d-none');
    setTimeout(() => {
        window.addEventListener('mousemove', listener, false);
        window.addEventListener('touchmove', listener, false);
        // window.addEventListener('touchmove', function(event) {
        //     touchLocation = event.targetTouches[0].pageX;
        //     console.log(touchLocation);
        //     player.update(event);

            
        // })
    }, 10);
    spawnProjectilesInterval = setInterval(spawnProjectiles, 300);
}

function endGame() {
    clearInterval(spawnEnemiesInterval);
    clearInterval(spawnProjectilesInterval);
    window.removeEventListener('click', listener, false);
    window.removeEventListener('touchstart', listener, false);
    modalElement.addClass('d-flex');
    modalElement.removeClass('d-none');
    canvas.style.display = "none";
    playerElement.hide();
    stats.hide();
    palavrasDiv.hide();
    palavrasDiv.children().remove();
}

function shuffleArray(array) {
    let indexes = []
    let shuffledArray = [];

    for(let i=0; i < array.length-1; i++) {
        indexes.push(i); 
    }

    // // First text always first
    // shuffledArray.push(array[0]);

    // Gera um indice aleatório, adiciona a carta do deck ao
    // shuffled deck e elimina esse índice das opções
    for(let i=0; i < array.length-1; i++) {
        let index = Math.floor(Math.random() * indexes.length);
        shuffledArray.push(array[indexes[index]]);
        indexes.splice(index, 1);
    }
    return shuffledArray;
}

 // Increase score
function updateScore(scoreEl, value) {
    score += value;
    scoreEl.html(score);
}

function updateLevel() {
    let nextLevelScore = Math.round(1000 * Math.pow(currentLevel, 1.5));
    if(score > nextLevelScore) {
        currentLevel++;
        levelElement.html(currentLevel);
        updateEnemyInterval();
    }
}

function updateEnemyInterval() {
    clearInterval(spawnEnemiesInterval);
    let interval = (1500*Math.pow(0.9, currentLevel));
    spawnEnemiesInterval = setInterval(spawnEnemies, interval > 300 ? interval : 300);
}

let spawnEnemiesInterval;
// Spawn enemies
function spawnEnemies() {
        
        if(palavrasIndex == palavrasShuffled.length) {
            palavrasIndex = 0;
        }

        let maxEnemyRadius = 60; 
        let EnemyRadius = Math.random() * (maxEnemyRadius - 10) + 10;
        let enemyX = Math.random() * (canvas.width - 2*maxEnemyRadius*2) + maxEnemyRadius*2; //canvas.width/2
        let enemyY = 0 - maxEnemyRadius*2;
        let enemyColor = `hsl(${Math.random()*360}, 40%, 50%)`;
        let enemyVelocity = {
            x: 0,
            y: Math.min((2*Math.pow(1.1, currentLevel)), 6)
        };
        let palavra = null;
        if(EnemyRadius > 20) {
            palavra = palavrasShuffled[palavrasIndex];
        }
        
        enemies.push(new Enemy(enemyX, enemyY, EnemyRadius, enemyColor, enemyVelocity, palavra));
        
        if(EnemyRadius > 20) {
            palavrasIndex++; 
        }
       
}


let spawnProjectilesInterval;
// Spawn enemies
function spawnProjectiles() {
    projectiles.push(new Projectile(player.x, player.y -17, projectileRadius, projectileColor, projectileVelocity)); 
}


let animationId;
let score = 0;
let currentLevel = 1;

// Animates frame by frame
function animate() {
    animationId = requestAnimationFrame(animate);

    // Resizing frame
    if(canvas.width !== innerWidth || canvas.height !== innerHeight){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }  
    
    // Cleans background
    c.fillStyle = 'rgba(0, 0, 0)'; 
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    updateLevel();

    player.draw();

    for(let i in particles) {
        let particle = particles[i];
        if(particle.alpha <= 0) {
            particles.splice(i, 1);
        }
        else {
            particle.update();
        }
       
    }

    // Draw and deletes projectiles
    for(let i in projectiles) {
        let projectile = projectiles[i];
        
        projectile.update();

        // Remove projectile from edges of the screen
        if(projectile.y + projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0); 
        }
    }


    // Draws and deletes enemies
    // Check game over and projectile collision
    for(let i in enemies) {
        let enemy = enemies[i];
        enemy.update();

        // Collision detection (player and enemy) - Game over
        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y); 
        if( dist - (enemy.radius) <= 0 ||  
            ( (enemy.y > player.y) && (enemy.x > player.x - player.w/4)  && (enemy.x < player.x + player.w/4) ) ) {
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, 0);
            modalElement.addClass('d-flex');
            modalElement.removeClass('d-none');
            endGame();
           
        }

        for(let j in projectiles) {
            let projectile = projectiles[j];
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            
            // Collision detection (projectile and enemy)
            if(dist - (enemy.radius + projectile.radius) < 1) {

                // Shrink if big enough
                if(enemy.radius - 20 > 10 ) {
                    updateScore(scoreElement, Math.round(3*enemy.radius));

                    // Interpolate
                    gsap.to(enemy, {
                        radius: enemy.radius - 15
                    });

                    setTimeout(() => { 
                        projectiles.splice(j, 1);
                    }, 0);  
                }
                // Remove from scene
                else {
                    updateScore(scoreElement, Math.round(15*enemy.radius));

                    setTimeout(() => {
                        // Explosion effect
                        for(let i=0; i < enemy.radius* numParticlesRatio; i++) {
                            particles.push(new Particle(projectile.x, projectile.y, particleRadius, enemy.color));
                        }        
                        $(`#${enemy.id}`).remove();        
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                    }, 0);  
                }
            }
        }

        // Remove enemy from edges of the screen - Game over
        if(enemy.y + enemy.radius > canvas.height) {
            // setTimeout(() => {
            //     enemies.splice(i, 1);
            // }, 0); 
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, 0);
            endGame();          
        }
    }
}

let listener = function (event){
    player.update(event);
}

startGameBtn.addEventListener('touchstart', (event) => {
    initGame();
});

startGameBtn.addEventListener('click', (event) => {
    initGame();
});
