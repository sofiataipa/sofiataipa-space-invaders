// Game variables
let player;
let projectiles;
let enemies;
let particles;
let propostas; 

let spawnEnemiesInterval;

// Game constants
const friction = 0.99;

// Animation
let animationId;

function main() { 
    // Game setup (Canvas)
    const cnv = document.querySelector('canvas');
    const c = cnv.getContext('2d'); // Context

    cnv.width = innerWidth;
    cnv.height = innerHeight;

    // Game elements
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

    // Player variables
    let playerW = parseFloat(playerElement.css('width'));
    let playerH = parseFloat(playerElement.css('height'));
    let playerX = cnv.width/2;
    let playerY = cnv.height - (playerH);
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
    // player = new Player(playerX, playerY, playerW, playerH, playerColor);
    // projectiles = [];
    // enemies = [];
    // particles  = [];
    propostas = getPropostas(); 

    let propostasShuffled = shuffleArray(propostas);;
    // First text always first
    // propostasElement.html(propostas[propostasIndex]);

    let palavras = getPalavras();

    let palavrasShuffled = shuffleArray(palavras);
    let palavrasIndex = 0;

    let currentLevel = 1;

    // EVENTS 

    // Init Game Button
    // Mobile
    startGameBtn.addEventListener('touchend', (event) => {
        initGame();
    });
    
    // Computer
    startGameBtn.addEventListener('click', (event) => {
        initGame();
    });
    
    // Window on stand-by event
    document.addEventListener('visibilitychange', function() {
        if(document.hidden) {
            // Tab is now inactive
            clearInterval(spawnEnemiesInterval);
            clearInterval(spawnProjectilesInterval);
        }
        else {
            // Tab is active again
            spawnProjectilesInterval = setInterval(spawnProjectiles, 300);
            updateEnemyInterval();
        }
    });
}

function initGame(cnv, score, stats, scoreElement, palavrasDiv, lastScoreElement, propostasElement, modalElement) {  
    // Game Variables
    player = new Player(playerX, playerY, playerW, playerH, playerColor);
    projectiles = [];
    enemies = [];
    particles  = [];

    let score = 0;
    currentLevel = 1;
    levelElement.html(currentLevel);

    let propostasIndex = 0;

    updateScore(scoreElement, score, 0);
    updateScore(lastScoreElement, score, 0);

    cnv.style.display = "";
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
    cnv.style.display = "none";
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
function updateScore(scoreEl, score, value) {
    score += value;
    scoreEl.html(score);
}

function updateLevel(currentLevel, score) {
    let nextLevelScore = Math.round(2500 * Math.pow(currentLevel, 1.5));
    if(score > nextLevelScore) {
        currentLevel++;
        levelElement.html(currentLevel);
        updateEnemyInterval();
    }
}

function updateEnemyInterval() {
    clearInterval(spawnEnemiesInterval);
    let interval = (1000*Math.pow(0.9, currentLevel));
    spawnEnemiesInterval = setInterval(spawnEnemies, interval > 500 ? interval : 500);
}


// Spawn enemies
function spawnEnemies() {
        if(palavrasIndex == palavrasShuffled.length) {
            palavrasIndex = 0;
        }
        let h = parseFloat(stats.css('height'));
        let maxEnemyRadius = 50; 
        let EnemyRadius = Math.random() * (maxEnemyRadius - 10) + 10;
        let enemyX = Math.random() * (cnv.width - 2*maxEnemyRadius) + maxEnemyRadius; 
        let enemyY = h - maxEnemyRadius;
        let enemyColor = `hsl(${Math.random()*360}, 40%, 50%)`;
        let enemyVelocity = {
            x: 0,
            y: Math.min((3*Math.pow(1.05, currentLevel)), 5)
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

// Spawn projectiles
function spawnProjectiles() {
    projectiles.push(new Projectile(player.x, player.y -17, projectileRadius, projectileColor, projectileVelocity)); 
}

// Animates frame by frame
function animate() {
    animationId = requestAnimationFrame(animate);

    // Resizing frame
    if(cnv.width !== innerWidth || cnv.height !== innerHeight){
        cnv.width = innerWidth;
        cnv.height = innerHeight;
    }  
    
    // Cleans background
    c.fillStyle = 'rgba(0, 0, 0)'; 
    c.fillRect(0, 0, cnv.width, cnv.height);
    
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
            updateScore(lastScoreElement, score, 0);
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
                    updateScore(scoreElement, score, Math.round(3*enemy.radius));

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
                    updateScore(scoreElement, score, Math.round(15*enemy.radius));
                    $(`#${enemy.id}`).remove(); 
                    setTimeout(() => {
                        // Explosion effect
                        for(let i=0; i < enemy.radius* numParticlesRatio; i++) {
                            particles.push(new Particle(projectile.x, projectile.y, particleRadius, enemy.color));
                        }               
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                    }, 0);  
                }
            }
        }

        // Remove enemy from edges of the screen - Game over
        if(enemy.y + enemy.radius > cnv.height) {
            // setTimeout(() => {
            //     enemies.splice(i, 1);
            // }, 0); 
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, score, 0);
            endGame();          
        }
    }

    let exists = false;
    palavrasDiv.children().each( function() {
        for(let i in enemies) {
            let enemy = enemies[i];
            if($(this).attr("id") == enemy.id) {
                exists = true;
            }
        }
        if(!exists) {
            $(this).remove();
        }
    }); 
    
}

let listener = function (event){
    player.update(event);
}

function getPalavras() {
    return ([ 
    'PeliCuf' , 'LIA' , 'Workshops' , 'Palestras' , 'Research4U' , 'Proatividade' ,
    '+Estágios' , '+Congressos' , 'Piati' , '+Parcerias ' , 'Med On Tour' , 'Ser Abrigo' , 
    'B.A.' , 'Expansão' , 'Sunsets' , 'SCOPE' , 'SCORE' , 'PET/T4PE' , 
    'Erasmus+' , 'Buddy' , 'Quizzes' , 'Soft Skills' , 'Bolsas' , 'Literatura Ativa' , 
    'Vendas Online' , 'Camisolas SBV' , '+Representação' , 'SIGMA' , 'Sistema de Pontos' , 'APP AEFCM' , 
    'Proximidade' , 'COVID-19' , 'NMS Photography' , 'Podcast' , 'Desafios' , 'Concursos' , 
    'Stand Up' , 'Concertos' , 'Bares' , 'Discotecas' , 'Arraial' , 'Film Club' , 
    'Disponibilidade' , 'Caixa de Dúvidas' , 'SASNOVA' , 'Soft Skills' , 'Torneios' , 'Programação' , 
    'Workshops' , 'Apoio 24/7' , 'Parcerias Desporto' , 'Proximidade' , 'Transparência' , 'Debate' , 
    ]);
}

function getPropostas() {
    return ([ 
    'Propomos a criação do Gabinete do estudante!' ,
    'Propomos um Espaço de Apoio Psicológico para os alunos, em parceria com o SASNOVA!' ,
    'Propomos um workshop “Início de vida adulta”!' ,
    'Propomos um workshop Python 101!' ,
    'Propomos um workshop de soft-skills: comunicação em público, networking, liderança!' ,
    'Propomos torneios desportivos: 3x3 Basket, padel, voleibol e outros!' ,
    'Propomos a organização de Sessões de Treino individual em casa!' ,
    'Propomos a criação da APP AEFCM!' ,
    'Propomos a criação do evento NMS Photography!' ,
    'Propomos Noites de Quizz de videoconferência online!' ,
    'Propomos a criação de um programa de integração dos novos alunos, Buddies!' ,
    'Propomos a explicação atempada e atrativa dos documentos apresentados em AG: por exemplo, com Doodle vídeos!' ,
    'Propomos a organização de um Virtual Speed Friending com recurso a plataforma online dirigido a alunos do 1º ano' ,
    'Propomos a criação de um Podcast!' , 
    'Propomos a continuação da Rubrica Cultural' ,
    'Propomos a criação de um Film Club!' , 
    'Propomos a promoção de parcerias com diversos espaços culturais!' , 
    'Propomos um concurso de fotografia!' , 
    'Propomos a criação de um concurso gastronómico!' , 
    'Propomos a organização da receção NMS, Arraial NMS e da Gala FCM|NMS 2021!' , 
    'Propomos a criação de um sistema de pontos para fins de intercâmbio a quem preencher todos os questionários de avaliação!' , 
    'Propomos a reestruturação dos questionários de qualidade de ensino através da apresentação do SIGMA!' , 
    'Propomos a elaboração de um “Quadro de Excelência do Corpo Docente”, onde se contemplam os Professores que obtêm melhor pontuação nos questionários, estimulando a melhoria do ensino!' , 
    'Propomos a disponibilização de lugares de estacionamento, nas várias Unidades Hospitalares!' , 
    'Propomos a criação um banco de livros não-técnicos usados, com troca dinâmica dos mesmos!' , 
    'Propomos a criação de um banco de camisolas de SBV, através de um sistema de aluguer!' , 
    'Propomos a otimização de vendas online e marketing da loja!' , 
    'Propomos uma receção NMS em formato espetáculo como, por exemplo, um concerto, cumprindo as normas vigentes pela DGS' , 
    'Propomos, em alternativa ao arrail NMS, um espetáculo como, por exemplo, stand up comedy, cumprindo as normas vigentes pela DGS' , 
    'Propomos a criação de uma plataforma de partilha de experiências internacionais no site da AEFCM!' , 
    'Propomos um novo projeto: Ser Abrigo,dirigido a grupos populacionais mais vulneráveis' , 
    'Propomos o projeto Acolher: dinamização do dia das matrículas. Alunos mais velhos que recebem os novos alunos e mostram a Faculdade, esclarecem dúvidas e dão orientações' , 
    'Propomos a continuidade do projeto O Meu Melhor Amigo!' , 
    'Propomos a organização do Congresso PECLICUF!' , 
    'Propomos a criação de vagas de estágio específicas para as especialidades!' ,  
    'Propomos a criação de mais bolsas de ação social!' ,
    'Propomos a criação de bolsas de mérito!' , 
    'Propomos a criação do Congresso PIATI!' , 
    'Propomos a promoção de competições, tanto presenciais, como via redes sociais, acerca das ciências básicas em Medicina!' , 
    'Propomos a organização de concursos clínicos via redes sociais, que complementam as formações dos estudantes!' , 
    'Propomos oferecer oportunidades de estágio que complementem algumas UC’s para o curso de nutrição!' , 
    'Propomos a criação de um programa de estágios clínicos e científicos para o curso de nutrição!' , 
    'Propomos a criação de grupos de interesse em variadas especialidades, constituídos por estudantes e por um médico orientador. ' , 
    'Propomos a criação do gabinete de "Expansão" que procede à elaboração de novos protocolos para projetos de outgoing e incoming!' , 
    'Propomos uma Welcome Week com sessão de receção aos alunos incoming, o sunset "Welcome Erasmus" e a Cultural Evening!' , 
    'Propomos' , 
    ]);
}