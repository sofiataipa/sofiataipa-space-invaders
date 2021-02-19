// Game variables
let player;
let projectiles;
let enemies;
let particles;
let score;
let currentLevel;

// Intervals for timeout
let spawnEnemiesInterval;
let spawnProjectilesInterval

// Game constants
const friction = 0.99;

// Animation TODO mudar nome
let listener;
let numParticlesRatio = 2;

// Game elements
let statsElement;
let scoreElement;
let levelElement;
let lastScoreElement;
let startGameBtn;
let modalElement;
let playerElement;

function main() { 
    // Game setup (Canvas)
    const cnv = document.querySelector('canvas');
    const c = cnv.getContext('2d'); // Context

    cnv.width = innerWidth;
    cnv.height = innerHeight;

    // Game elements
    statsElement = $('#stats');
    scoreElement = $('#score');
    levelElement = $('#level');
    lastScoreElement = $('#lastScore');
    startGameBtn = $('.btn')[0];
    modalElement = $('#modal');

    playerElement = $("#player");
   
    playerElement.hide();
    statsElement.hide();

    // EVENTS 
    listener = function (event){
        player.update(event);
    }
    
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

function initGame(cnv) { 
    // Player variables
    let playerW = parseFloat(playerElement.css('width'));
    let playerH = parseFloat(playerElement.css('height'));
    let playerX = cnv.width/2;
    let playerY = cnv.height - (playerH);
    let playerColor = 'white';

    // Create player
    player = new Player(playerX, playerY, playerW, playerH, playerColor);
    
    // Game Variables
    projectiles = [];
    enemies = [];
    particles  = [];

    score = 0;
    currentLevel = 1;

    levelElement.html(currentLevel);

    updateScore(scoreElement, 0);
    updateScore(lastScoreElement, 0);

    cnv.style.display = "";
    statsElement.show();

    animate();
    
    updateEnemyInterval();

    modalElement.removeClass('d-flex');
    modalElement.addClass('d-none');
    setTimeout(() => {
        window.addEventListener('mousemove', listener, false);
        window.addEventListener('touchmove', listener, false);
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
    statsElement.hide();
}

// Increase score
function updateScore(scoreEl, value) {
    score += value;
    scoreEl.html(score);
}

function updateLevel() {
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
        let h = parseFloat(statsElement.css('height'));
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
        enemies.push(new Enemy(enemyX, enemyY, EnemyRadius, enemyColor, enemyVelocity, palavra));
}

// Spawn projectiles
function spawnProjectiles() {
    // Projectile variables
    let projectileRadius = 8;
    let projectileColor = 'rgb(200, 220, 220)';  //'rgb(150, 40, 40)';
    let projectileVelocity = 5;

    projectiles.push(new Projectile(player.x, player.y -17, projectileRadius, projectileColor, projectileVelocity)); 
}

// Spawn particles
function spawnParticles(posx, posy) {
    // Particle variables
    let particleRadius = 2;

    particles.push(new Particle(posx, posy, particleRadius, enemy.color));
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
                    $(`#${enemy.id}`).remove(); 
                    setTimeout(() => {
                        // Explosion effect
                        for(let i=0; i < enemy.radius * numParticlesRatio; i++) {
                            spawnParticles(projectile.x, projectile.y);
                        }               
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                    }, 0);  
                }
            }
        }

        // Remove enemy from edges of the screen - Game over
        if(enemy.y + enemy.radius > cnv.height) {
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, 0);
            endGame();          
        }
    }    
}