function decrementTimer() {
    document.querySelector("#timer").innerHTML = timer;

    if(timer <= 0) {
        determineWinner({player, enemy, timerID});
    }

    if(timer > 0) {
        timerID = setTimeout(decrementTimer, 1000);
        timer--;
    }
}

function determineWinner({player, enemy, timerID}) {
    clearTimeout(timerID);
    window.removeEventListener('keydown', keydowns);
    window.removeEventListener('keyup', keyups);

    //replace winner div display of none with flex to display the div
    let winner_div = document.querySelector("#winner");
    winner_div.style.display = "flex";

    if(player.health === enemy.health) {
        winner_div.innerHTML = "It's a tie!";
    } else if (player.health > enemy.health) {
        winner_div.innerHTML = "Player wins!";
        enemy.dead();
    } else if (player.health < enemy.health) {
        winner_div.innerHTML = "Enemy wins!";
        player.dead();
    }
}

function weaponCollision({character1,character2}) {
    return (
        character1.weapon.position.x + character1.weapon.width >= character2.position.x &&
        character1.weapon.position.x <= character2.position.x + character2.width &&
        character1.weapon.position.y + character1.weapon.height >= character2.position.y &&
        character1.weapon.position.y <= character2.position.y + character2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate) //recursively animate forever

    background1.createBackground();
    background2.createBackground();
    background3.createBackground();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if(keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
    } else if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    if(player.velocity.y < 0) {
        player.switchSprite("down");
    } else if (player.velocity.y > 0) {
        player.switchSprite("up");
    }

    //enemy movement
    if(enemy.position.y > 400) {
        enemy.position.y = 400;
    }
    if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    //detect hit by player
    if(
        weaponCollision({character1: player, character2: enemy}) &&
        player.isAttacking &&
        player.frameCurrent == 5) {
            player.isAttacking = false;
            enemy.takeHit();
            let enemy_health = document.querySelector("#enemy-life-bar");
            enemy_health.style.width = enemy.health + "%";
    } 
    //detect miss
    if(player.isAttacking && player.frameCurrent == 5) {
        player.isAttacking = false;
    }

    //reset player taking hit
    if(player.takingHit && player.frameCurrent == 2) {
        player.takingHit = false;
    }

    //detect hit by enemy
    if(
        weaponCollision({character1: enemy, character2: player}) &&
        enemy.isAttacking &&
        enemy.frameCurrent == 2) {
            enemy.isAttacking = false;
            player.takeHit();
            let player_health = document.querySelector("#player-life-bar");
            player_health.style.width = player.health + "%";
    } 
    //detect miss
    if(enemy.isAttacking && enemy.frameCurrent == 5) {
        enemy.isAttacking = false;
    }

    //reset enemy taking hit
    if(enemy.takingHit && enemy.frameCurrent == 2) {
        enemy.takingHit = false;
    }

    if(player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy, timerID});
    }
}

function keydowns(event) {
    console.log(event.key);
    switch(event.key) {
        case "d":
            player.lastKey = "d";
            keys.d.pressed = true;
            break;
        case "a":
            player.lastKey = "a";
            keys.a.pressed = true;
            break;
        case "w":
            if(player.velocity.y === 0) {
                player.velocity.y = -20;
            }
            
            break;
        case " ":
            if(!player.takingHit) player.attack();
            break;
        //enemy keys
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.lastKey = "ArrowUp";
            if(enemy.velocity.y === 0) {
                enemy.velocity.y = -20;
            }
            break;
        case "ArrowDown":
            if (!enemy.takingHit) enemy.attack();
            break;
    }
}

function keyups(event) {
    console.log(event.key);
    switch(event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
}
