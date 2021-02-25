// Game variables
let player;
let projectiles;
let enemies;
let particles;
let score;
let currentLevel;
let stars;

// Projectile variables
let projectileRadius = 4;
let projectileColor = 'rgb(220, 159, 189)';
let projectileVelocity = 5;

// Particle variables
let particleRadius = 2;

// Intervals for timeout
let spawnEnemiesInterval;
let spawnProjectilesInterval

// Animation Variables
let playerListener;
let numParticlesRatio = 2;

// Game elements
let statsElement;
let scoreElement;
let levelElement;
let lastScoreElement;
let startGameBtn;
let modalElement;
let playerElement;

// Game constants
const FRICTION = 0.99;
// Star Background
const N_STARS = 80;
const MAX_STAR_SIZE = 0.7;
const MIN_STAR_SIZE = 2;
const STAR_INI_SPEED = 0.2;
const STAR_COLOR = "rgb(255, 255, 255)";

// Sound
const laserSound = new Audio('../assets/laser.wav');
const buttonClickSound = new Audio('../assets/buttonClick.wav');

function main() { 
    // Game setup (Canvas)
    const cnv = document.getElementById('game');
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

    // Display the top 3 scores
    displayScoreBoard();

    /* 
     * EVENTS 
     */

    // Add event that updates Player position 
    playerListener = function (event){
        player.update(event, cnv);
    }

    // Init Game Button
    // Mobile
    startGameBtn.addEventListener('touchend', (event) => {
        initGame(cnv);
    });
    
    // Computer
    startGameBtn.addEventListener('click', (event) => {
        initGame(cnv);
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
    buttonClickSound.play();

    // Player variables
    let playerW = parseFloat(playerElement.css('width'));
    let playerH = parseFloat(playerElement.css('height'));
    let playerX = cnv.width/2;
    let playerY = cnv.height - (playerH);

    // Create player
    player = new Player(playerX, playerY, playerW);
    
    // Game Variables
    projectiles = [];
    enemies = [];
    particles  = [];

    // Score and Level
    score = 0;
    currentLevel = 1;
    levelElement.html(currentLevel);
    updateScore(scoreElement, 0);
    updateScore(lastScoreElement, 0);

    // Create the star background
    spawnStars(cnv);
    
    // Display Canvas and Stats bar
    cnv.style.display = "";
    statsElement.show();

    // Hide Menu
    modalElement.removeClass('d-flex');
    modalElement.addClass('d-none');

    // Add Player Movement event after 10 milisseconds
    setTimeout(() => {
        window.addEventListener('mousemove', playerListener, false);
        window.addEventListener('touchmove', playerListener, false);
    }, 10);

    // Define enemy spawn interval in function of level
    updateEnemyInterval();
    // Define projectile spawn interval
    spawnProjectilesInterval = setInterval(spawnProjectiles, 300);

    // Start animation
    animate();
}

function endGame(cnv) {
    // Stop enemy and projectile spawn
    clearInterval(spawnEnemiesInterval);
    clearInterval(spawnProjectilesInterval);

    // Remove Player Movement event
    window.removeEventListener('click', playerListener, false);
    window.removeEventListener('touchstart', playerListener, false);
    
    // Update the top 3 scores
    displayScoreBoard();

    // Show Menu
    modalElement.addClass('d-flex');
    modalElement.removeClass('d-none');

    // Hide canvas, player and stats
    cnv.style.display = "none";
    playerElement.hide();
    statsElement.hide();
}

/*
 * Update and display the top 3 scores
 */
function displayScoreBoard() {
    if(score > 0) {
        saveScoreLS(score);
    }
    let topScores = getBestScoresLS(3);
    for (let i = 0; i < topScores.length; i++) {
        $(`#top${i+1}`).html(`${topScores[i]}`);
    }
}

/*
 * Increase score HTML
 */
function updateScore(scoreEl, value) {
    score += value;
    scoreEl.html(score);
}

/*
 * Check if next level as begun in function of score
 */
function updateLevel() {
    let nextLevelScore = Math.round(2500 * Math.pow(currentLevel, 1.5));
    if(score > nextLevelScore) {
        currentLevel++;
        levelElement.html(currentLevel);
        updateEnemyInterval();
        updateStarsVelocity();
    }
}

/*
 * Interval of enemy spawn in function of level
 */
function updateEnemyInterval() {
    clearInterval(spawnEnemiesInterval);
    let interval = (1000*Math.pow(0.9, currentLevel));
    spawnEnemiesInterval = setInterval(spawnEnemies, interval > 500 ? interval : 500);
}

/*
 * Spawn Stars
 */
function spawnStars(cnv) {   
    stars = [];
    for (let i = 0; i < N_STARS; i++) {
        // Star variables
        let r = Math.random() * (MAX_STAR_SIZE - MIN_STAR_SIZE) + MIN_STAR_SIZE;
        let x = Math.floor(Math.random() * cnv.width);
        let y = Math.floor(Math.random() * cnv.height);
        let v = Math.min((3*Math.pow(1.05, currentLevel)), 5) + r * 0.6;
        
        stars.push(new Star(x, y, r, STAR_COLOR, v));
    }
}

/*
 * Update stars velocity (in function of level)
 */
function updateStarsVelocity() {
    for (let i = 0; i < N_STARS; i++) {
        stars[i].setVelocity(Math.min((3*Math.pow(1.05, currentLevel)), 5) + stars[i].dim * 0.6);
    }
}

/*
 * Spawn enemies
 */
function spawnEnemies() {
    const cnv = document.querySelector('canvas');
    let h = 0;
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

/*
 * Spawn projectiles
 */
function spawnProjectiles() {
    projectiles.push(new Projectile(player.x, player.y -17, projectileRadius, projectileColor, projectileVelocity)); 
}

/*
 * Spawn particles
 */
function spawnParticles(posx, posy, color) {
    particles.push(new Particle(posx, posy, particleRadius, color));
}

/*
 * Animates frame by frame
 */
function animate() {
    const cnv = document.querySelector('canvas');
    const c = cnv.getContext('2d'); // Context

    // Saves current frame
    animationId = requestAnimationFrame(animate);
    
    // Resizing frame
    if(cnv.width !== innerWidth || cnv.height !== innerHeight){
        cnv.width = innerWidth;
        cnv.height = innerHeight;
    }  
    
    // Cleans background
    c.fillStyle = 'rgb(20, 20, 20)'; 
    c.fillRect(0, 0, cnv.width, cnv.height);
    
    // Check if next level as begun
    updateLevel();

    // Draws player in current position of mouse or touch
    player.draw();

    // Draw and update stars
    for (let i = 0; i < N_STARS; i++) {
        stars[i].update(cnv);
    }

    // Draw particles
    for(let i in particles) {
        let particle = particles[i];
        if(particle.alpha <= 0) {
            particles.splice(i, 1);
        }
        else {
            particle.update(cnv);
        }
    }

    // Draw and deletes projectiles
    for(let i in projectiles) {
        let projectile = projectiles[i];
        
        projectile.update(cnv);

        // Remove projectile from edges of the screen
        if(projectile.y + projectile.dim < 0) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0); 
        }
    }

    // Draws and deletes enemies
    // Check game over and projectile collision
    for(let i in enemies) {
        let enemy = enemies[i];
        enemy.update(cnv);

        // Collision detection (player and enemy) - Game over
        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y); 
        if( dist - (enemy.dim) <= 0 ||  
            ( (enemy.y > player.y) && (enemy.x > player.x - player.w/4)  && (enemy.x < player.x + player.w/4) ) ) {
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, 0);
            modalElement.addClass('d-flex');
            modalElement.removeClass('d-none');
            endGame(cnv);  
        }

        for(let j in projectiles) {
            let projectile = projectiles[j];
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            
            // Collision detection (projectile and enemy)
            if(dist - (enemy.dim + projectile.dim) < 1) {
                laserSound.play();

                // Shrink if big enough
                if(enemy.dim - 20 > 10 ) {
                    updateScore(scoreElement, Math.round(3*enemy.dim));

                    // Interpolate
                    gsap.to(enemy, {
                        dim: enemy.dim - 15
                    });

                    setTimeout(() => { 
                        projectiles.splice(j, 1);
                    }, 0);  
                }
                // Remove from scene
                else {
                    updateScore(scoreElement, Math.round(15*enemy.dim));
                    $(`#${enemy.id}`).remove(); 
                    setTimeout(() => {
                        // Explosion effect
                        for(let i=0; i < enemy.dim * numParticlesRatio; i++) {
                            spawnParticles(projectile.x, projectile.y, enemy.color);
                        }               
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                    }, 0);  
                }
            }
        }

        // Remove enemy from edges of the screen - Game over
        if(enemy.y + enemy.dim > cnv.height) {
            $(`#${enemy.id}`).remove();
            cancelAnimationFrame(animationId);
            updateScore(lastScoreElement, 0);
            endGame(cnv);          
        }
    }    
}

/*
 * Saves last score on LocalStorage
 */
function saveScoreLS(score) {
    let d = new Date();
    let xmlTag = `<Score>${score}</Score>`
    window.localStorage.setItem(d.getTime(), xmlTag);
}

/*
 * Gets top scores on LocalStorage
 */
function getBestScoresLS(num) {
    let top = [];

    let indexStorage = window.localStorage.length;
    for (let i = 0; i < indexStorage; i++) {
        if(window.DOMParser){
            let localStorageRow = window.localStorage.getItem(window.localStorage.key(i));
            if(window.DOMParser) {
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(localStorageRow, "application/xml");
            }
        }

        let scoreTag = xmlDoc.getElementsByTagName("Score");
        top.push(scoreTag[0].textContent);
    }
    top.sort((a, b) => b - a);
    if(top.length >= num)
        top.slice(0, num);
    return top;
}