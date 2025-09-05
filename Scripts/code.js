
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const gameArea = document.getElementById("gameArea");

let playerPos = { top: 50, left: 50, size: 40, speed: 10 };

// تحريك اللاعب
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") playerPos.top -= playerPos.speed;
    if (e.key === "ArrowDown") playerPos.top += playerPos.speed;
    if (e.key === "ArrowLeft") playerPos.left -= playerPos.speed;
    if (e.key === "ArrowRight") playerPos.left += playerPos.speed;

    // boundaries
    if (playerPos.top < 0) playerPos.top = 0;
    if (playerPos.left < 0) playerPos.left = 0;
    if (playerPos.top + playerPos.size > gameArea.clientHeight)
        playerPos.top = gameArea.clientHeight - playerPos.size;
    if (playerPos.left + playerPos.size > gameArea.clientWidth)
        playerPos.left = gameArea.clientWidth - playerPos.size;


    if (e.key === "ArrowUp" && e.key === "ArrowLeft") {
        playerPos.top -= playerPos.speed;
        playerPos.left -= playerPos.speed;
        player.style.transform = "rotate(225deg)";
    }
    if (e.key === "ArrowUp" && e.key === "ArrowRight") {
        playerPos.top -= playerPos.speed;
        playerPos.left += playerPos.speed;
        player.style.transform = "rotateY(315deg)";
    }
    if (e.key === "ArrowDown" && e.key === "ArrowLeft") {
        playerPos.top += playerPos.speed;
        playerPos.left -= playerPos.speed;
        player.style.transform = "rotate(135deg)";
    }
    if (e.key === "ArrowDown" && e.key === "ArrowRight") {
        playerPos.top += playerPos.speed;
        playerPos.left += playerPos.speed;
        player.style.transform = "rotate(45deg)";
    }

    // تحديث position
    player.style.top = playerPos.top + "px";
    player.style.left = playerPos.left + "px";

    // كشف الاصطدام
    checkCollision();
});



function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
        playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left &&
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top
    ) {
        enemy.style.display = "none"; // اختفاء العدو
        alert("Collision detected! Enemy disappeared.");
    }
}



// let keys = {};

// function handelMove() {
//     // لما يضغط زر
//     document.addEventListener("keydown", (e) => {
//         keys[e.key] = true;
//         movePlayer();
//     });

//     // لما يرفع ايده عن الزر
//     document.addEventListener("keyup", (e) => {
//         keys[e.key] = false;
//     });
// }

// function movePlayer() {
//     // ↑
//     if (keys["ArrowUp"] && !keys["ArrowLeft"] && !keys["ArrowRight"]) {
//         playerPos.top -= playerPos.speed;
//         player.style.transform = "rotate(90deg)";
//     }
//     // ↓
//     if (keys["ArrowDown"] && !keys["ArrowLeft"] && !keys["ArrowRight"]) {
//         playerPos.top += playerPos.speed;
//         player.style.transform = "rotate(-90deg)";
//     }
//     // ←
//     if (keys["ArrowLeft"] && !keys["ArrowUp"] && !keys["ArrowDown"]) {
//         playerPos.left -= playerPos.speed;
//         player.style.transform = "rotate(0deg)";
//     }
//     // →
//     if (keys["ArrowRight"] && !keys["ArrowUp"] && !keys["ArrowDown"]) {
//         playerPos.left += playerPos.speed;
//         player.style.transform = "rotateY(180deg)";
//     }

//     // ↖
//     if (keys["ArrowUp"] && keys["ArrowLeft"]) {
//         playerPos.top -= playerPos.speed;
//         playerPos.left -= playerPos.speed;
//         player.style.transform = "rotate(45deg)";
//     }
//     // ↗
//     if (keys["ArrowUp"] && keys["ArrowRight"]) {
//         playerPos.top -= playerPos.speed;
//         playerPos.left += playerPos.speed;
//         player.style.transform = "rotate(135deg)";
//     }
//     // ↙
//     if (keys["ArrowDown"] && keys["ArrowLeft"]) {
//         playerPos.top += playerPos.speed;
//         playerPos.left -= playerPos.speed;
//         player.style.transform = "rotate(315deg)";
//     }
//     // ↘
//     if (keys["ArrowDown"] && keys["ArrowRight"]) {
//         playerPos.top += playerPos.speed;
//         playerPos.left += playerPos.speed;
//         player.style.transform = "rotate(225deg)";
//     }

//     // boundaries
//     if (playerPos.top < 0) playerPos.top = 0;
//     if (playerPos.left < 0) playerPos.left = 0;
//     if (playerPos.top + playerPos.size > gameArea.clientHeight)
//         playerPos.top = gameArea.clientHeight - playerPos.size;
//     if (playerPos.left + playerPos.size > gameArea.clientWidth)
//         playerPos.left = gameArea.clientWidth - playerPos.size;

//     // تحديث position
//     player.style.top = playerPos.top + "px";
//     player.style.left = playerPos.left + "px";
// }

// handelMove();





// ==================================


if (isTouching(playerBox, fishBox)) {
    if (fish.classList.contains("smallFish")) {
        respawnFish(fish, areaWidth, areaHeight);
        cnt++;
        updatePlayerStatus();
    }
    else if (fish.classList.contains("mediumFish")) {
        if (PlayerStatus === "smallFish") {
            gameOver("خسرت! لمست سمكة أكبر منك");
        } else {
            respawnFish(fish, areaWidth, areaHeight);
            cnt++;
            updatePlayerStatus();
        }
    }
    else if (fish.classList.contains("shark")) {
        if (PlayerStatus === "mediumFish") {
            gameOver("خسرت! الشارك أكلَك 🚫");
        } else if (PlayerStatus === "largFish") {
            respawnFish(fish, areaWidth, areaHeight);
            cnt++;
        } else {
            gameOver("خسرت! الشارك أكلَك 🚫");
        }
    }

    counter.innerHTML = cnt;

    // شرط الفوز
    if (PlayerStatus === "largFish" && cnt >= 20) {
        gameWin();
    }
}