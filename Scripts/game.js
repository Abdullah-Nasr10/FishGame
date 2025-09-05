

// =============== Game ===============
class GameObject {
    constructor(element, x, y, width, height, speed) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 'right';
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    getBoundingBox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    isCollidingWith(other) {
        const thisBox = this.getBoundingBox();
        const otherBox = other.getBoundingBox();

        return (
            thisBox.left < otherBox.right &&
            thisBox.right > otherBox.left &&
            thisBox.top < otherBox.bottom &&
            thisBox.bottom > otherBox.top
        );
    }
}


//============== Player Class ===============
class Player extends GameObject {
    constructor(element, x, y, size, speed) {
        super(element, x, y, size, size, speed);
        this.score = 0;
        this.status = 'smallFish';
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    handleKeyPress(e) {
        // const oldX = this.x;
        // const oldY = this.y;

        switch (e.key) {
            case 'ArrowUp':
                this.y -= this.speed;
                this.element.style.transform = 'rotate(90deg)';
                break;
            case 'ArrowDown':
                this.y += this.speed;
                this.element.style.transform = 'rotate(-90deg)';
                break;
            case 'ArrowLeft':
                this.x -= this.speed;
                this.element.style.transform = 'rotate(0deg)';
                break;
            case 'ArrowRight':
                this.x += this.speed;
                this.element.style.transform = 'rotateY(180deg)';
                break;
        }

        this.enforceBoundaries();
        this.updatePosition();
    }

    enforceBoundaries() {
        const gameArea = document.querySelector('.gameArea');
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > areaWidth) this.x = areaWidth - this.width;
        if (this.y + this.height > areaHeight) this.y = areaHeight - this.height;
    }

    updateStatus() {
        if (this.score >= 4 && this.score < 8) {
            this.status = 'mediumFish';
            this.width = 100;
            this.height = 100;
            this.element.style.width = '100px';
        } else if (this.score >= 8) {
            this.status = 'largFish';
            this.width = 180;
            this.height = 180;
            this.element.style.width = '180px';
        }
    }

    addScore(points = 1) {
        this.score += points;
        this.updateStatus();
        return this.score;
    }
}


//============== Fish Classes ===============
class Fish extends GameObject {
    constructor(element, x, y, width, height, speed, fishType) {
        super(element, x, y, width, height, speed);
        this.fishType = fishType;
        this.isActive = true; // إضافة حالة للسمكة
        this.setupMovement();
    }

    setupMovement() {
        this.setRandomDirection();


        this.element.style.transition = 'top 0.1s linear, left 0.1s linear';

        // Change direction every 3 seconds
        setInterval(() => {
            this.setRandomDirection();
        }, 3000);
    }

    setRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        this.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    setRandomPosition() {
        const gameArea = document.querySelector('.gameArea');
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;

        let attempts = 0;
        let newX, newY;

        do {
            newX = Math.random() * (areaWidth - this.width);
            newY = Math.random() * (areaHeight - this.height);
            attempts++;
        } while (this.isPositionOccupied(newX, newY) && attempts < 10);

        this.x = newX;
        this.y = newY;


        this.element.style.display = 'block';
        this.isActive = true;
        this.updatePosition();

        console.log(`${this.fishType} positioned at (${this.x}, ${this.y})`);
    }

    isPositionOccupied(x, y) {

        const gameManager = window.gameManager;
        if (!gameManager) return false;

        const fishCollision = gameManager.fishes.some(fish => {
            if (fish === this || !fish.isActive) return false;

            const distance = Math.sqrt(
                Math.pow(x - fish.x, 2) + Math.pow(y - fish.y, 2)
            );
            return distance < (this.width + fish.width) / 2;
        });

        if (gameManager.player) {
            const playerDistance = Math.sqrt(
                Math.pow(x - gameManager.player.x, 2) + Math.pow(y - gameManager.player.y, 2)
            );
            const playerCollision = playerDistance < (this.width + gameManager.player.width) / 2;

            return fishCollision || playerCollision;
        }

        return fishCollision;
    }

    move() {

        if (!this.isActive) return;

        switch (this.direction) {
            case 'up':
                this.y -= this.speed;
                this.element.style.transform = 'rotate(90deg)';
                break;
            case 'down':
                this.y += this.speed;
                this.element.style.transform = 'rotate(-90deg)';
                break;
            case 'left':
                this.x -= this.speed;
                this.element.style.transform = 'rotate(0deg)';
                break;
            case 'right':
                this.x += this.speed;
                this.element.style.transform = 'rotateY(180deg)';
                break;
        }

        this.enforceBoundaries();
        this.updatePosition();


    }

    enforceBoundaries() {
        const gameArea = document.querySelector('.gameArea');
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;

        if (this.y < 0) {
            this.y = 0;
            this.direction = 'down';
        }
        if (this.x < 0) {
            this.x = 0;
            this.direction = 'right';
        }
        if (this.y + this.height > areaHeight) {
            this.y = areaHeight - this.height;
            this.direction = 'up';
        }
        if (this.x + this.width > areaWidth) {
            this.x = areaWidth - this.width;
            this.direction = 'left';
        }
    }

    respawn() {
        this.isActive = false;
        this.element.style.display = 'none';

        this.setRandomDirection();

        setTimeout(() => {
            this.setRandomPosition();
        }, 1000);
    }
}


//============== Specific Fish Types ===============
class SmallFish extends Fish {
    constructor(element, x, y) {
        super(element, x, y, 50, 50, 10, 'smallFish');
    }
}

class MediumFish extends Fish {
    constructor(element, x, y) {
        super(element, x, y, 80, 80, 8, 'mediumFish');
    }
}

class Shark extends Fish {
    constructor(element, x, y) {
        super(element, x, y, 120, 120, 6, 'shark');
    }
}


//============== Game Manager ===============
class GameManager {
    constructor() {
        this.gameArea = document.querySelector('.gameArea');
        this.counter = document.querySelector('.counter');
        this.lossBox = document.getElementById('loss');
        this.winBox = document.getElementById('win');
        this.lossTryAgainBtn = document.getElementById('losstryBtn');
        this.winTryAgainBtn = document.getElementById('wintryBtn');

        this.areaWidth = this.gameArea.clientWidth;
        this.areaHeight = this.gameArea.clientHeight;

        this.isGameRunning = true;
        this.setupGame();
    }

    setupGame() {

        const playerElement = document.getElementById('player');
        this.player = new Player(playerElement, 50, 50, 75, 15);


        this.fishes = [];
        this.initializeFishes();


        this.gameLoop();


        this.setupEventListeners();
    }

    initializeFishes() {

        document.querySelectorAll('.smallFish').forEach(fishElement => {
            const fish = new SmallFish(fishElement, 0, 0);
            this.fishes.push(fish);
        });


        document.querySelectorAll('.mediumFish').forEach(fishElement => {
            const fish = new MediumFish(fishElement, 0, 0);
            this.fishes.push(fish);
        });


        const sharkElement = document.querySelector('.shark');
        if (sharkElement) {
            const shark = new Shark(sharkElement, 0, 0);
            this.fishes.push(shark);
        }


        this.fishes.forEach(fish => {
            fish.setRandomPosition();
        });

        console.log(`Initialized ${this.fishes.length} fishes`);
    }

    gameLoop() {
        if (!this.isGameRunning) return;


        this.fishes.forEach(fish => {
            if (fish && typeof fish.move === 'function') {
                fish.move();
            }
        });

        this.checkCollisions();


        setTimeout(() => this.gameLoop(), 100);
    }

    checkCollisions() {
        this.fishes.forEach(fish => {

            if (fish.isActive && this.player.isCollidingWith(fish)) {
                this.handleCollision(fish);
            }
        });
    }

    handleCollision(fish) {
        switch (fish.fishType) {
            case 'smallFish':
                this.handleSmallFishCollision(fish);
                break;
            case 'mediumFish':
                this.handleMediumFishCollision(fish);
                break;
            case 'shark':
                this.handleSharkCollision(fish);
                break;
        }
    }

    handleSmallFishCollision(fish) {
        fish.respawn();
        const newScore = this.player.addScore();
        this.updateCounter(newScore);
        this.checkWinCondition();
    }

    handleMediumFishCollision(fish) {
        if (this.player.status === 'smallFish') {
            this.gameOver();
        } else {
            fish.respawn();
            const newScore = this.player.addScore();
            this.updateCounter(newScore);
            this.checkWinCondition();
        }
    }

    handleSharkCollision(fish) {
        if (this.player.status === 'mediumFish') {
            this.gameOver();
        } else if (this.player.status === 'largFish') {
            fish.respawn();
            const newScore = this.player.addScore();
            this.updateCounter(newScore);
            this.checkWinCondition();
        } else {
            this.gameOver();
        }
    }

    updateCounter(score) {
        this.counter.innerHTML = score;
    }

    checkWinCondition() {
        if (this.player.status === 'largFish' && this.player.score >= 20) {
            this.gameWin();
        }
    }

    gameOver() {
        this.isGameRunning = false;
        this.lossBox.style.display = 'flex';
    }

    gameWin() {
        this.isGameRunning = false;
        this.winBox.style.display = 'flex';
    }

    setupEventListeners() {
        this.lossTryAgainBtn.addEventListener('click', () => {
            this.lossBox.style.display = 'none';
            location.reload();
        });

        this.winTryAgainBtn.addEventListener('click', () => {
            this.winBox.style.display = 'none';
            location.reload();
        });
    }
}




// =============== Game Initialization ===============

document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});