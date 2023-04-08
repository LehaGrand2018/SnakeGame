const FIELD_SIZE = 625;
const FIELD_WIDTH = 25;
const FIELD_HEIGHT = 25;
const START_SNAKE_SIZE = 5;
const UPDATE_TIME = 100;

const gameData = {
    lastDirection: 'right',
    score: 0,
    gameOver: false,    
    currentLenght: {
        Total: 5,
        X: 5,
        Y:1,
    },
    currentHead:{
        X: 1,
        Y: 1,
    },
    currentDirection: 'undefined',
    fieldBorderCoordinates: {
        right: 24,
        left: 0,
        top: 0,
        bottom: 24,
    },
    fieldBorder: {
        right: false,
        left: false,
        top: false,
        bottom: false,
    },
    activePixels: [],
    field: new Array(625),
    snake: {
        snakeCells:  [],
    },
    apple : {
        X: 1,
        Y: 1,
    },
};

// Initialize SnakeCells Array
for (let i = 0; i < START_SNAKE_SIZE; i++) {
    gameData.snake.snakeCells.push({
        type: 'undefined',
        coordinate: -1,
    });
}


// Initialize fieldPart Array
for (let i = 0; i < gameData.field.length; i++) {
    gameData.field[i] = {
        fieldPart: 'undefined',
    }
}

// Initialize fieldHTML Array
for (let i = 0; i < gameData.field.length; i++) {
    const snakeCell = document.createElement('div');
    snakeCell.className = 'field__cell';
    const fieldNode = document.querySelector('.field');
    fieldNode.append(snakeCell);
}

const listenerOfClick = (pressedKey) => {
    if(gameData.currentDirection !== 'left' && 
        (pressedKey.key === 'ArrowRight' || pressedKey.keyCode === 68)){
            gameData.currentDirection = 'right';
            console.log('Right');
            document.removeEventListener("keydown", listenerOfClick);
        }
        if(gameData.currentDirection !== 'right' && 
        (pressedKey.key === 'ArrowLeft' || pressedKey.keyCode === 65)){
            gameData.currentDirection = 'left';
            console.log('Left');
            document.removeEventListener("keydown", listenerOfClick);
        }
        if(gameData.currentDirection !== 'down' && 
        (pressedKey.key === 'ArrowUp' || pressedKey.keyCode === 87)){
            gameData.currentDirection = 'up';
            console.log('Up');
            document.removeEventListener("keydown", listenerOfClick);
        }
        if(gameData.currentDirection !== 'up' && 
        (pressedKey.key === 'ArrowDown' || pressedKey.keyCode == 83)){
            gameData.currentDirection = 'down';
            console.log('Down');
            document.removeEventListener("keydown", listenerOfClick);
        }
}

const listenButton = (gameData) => {
    document.addEventListener("keydown", listenerOfClick);
}

// const listenButton = (gameData) => {

    // document.addEventListener("keydown", (pressedKey) =>{
    // 
    //    console.dir(`Key: ${pressedKey.key} -- Code: ${pressedKey.keyCode}`); 
        // if(gameData.currentDirection !== 'left' && 
        // (pressedKey.key === 'ArrowRight' || pressedKey.keyCode === 68)){
        //     gameData.currentDirection = 'right';
        //     console.log('Right');
        //     return;
        // }
        // if(gameData.currentDirection !== 'right' && 
        // (pressedKey.key === 'ArrowLeft' || pressedKey.keyCode === 65)){
        //     gameData.currentDirection = 'left';
        //     console.log('Left');
        //     return;
        // }
        // if(gameData.currentDirection !== 'down' && 
        // (pressedKey.key === 'ArrowUp' || pressedKey.keyCode === 87)){
        //     gameData.currentDirection = 'up';
        //     console.log('Up');
        //     return;
        // }
        // if(gameData.currentDirection !== 'up' && 
        // (pressedKey.key === 'ArrowDown' || pressedKey.keyCode == 83)){
        //     gameData.currentDirection = 'down';
        //     console.log('Down');
        //     return;
        // }
        // return;
        // 
    // });
    
// }

const clearField = (gameData) => {
    gameData.field.forEach(element => {
        if(element.fieldPart !== 'apple'){
            element.fieldPart = 'undefined';
        }
    });
}

const rewriteSnakeCoordinates = (snakeCells, coordinate) => {
    for (let index = snakeCells.length - 1; index > 0 ; index--) {
        snakeCells[index].coordinate = snakeCells[index-1].coordinate;
        snakeCells[index].type = 'body';
    }
    snakeCells[0].coordinate = translateCoordinatesToIndex(gameData.currentHead);
    snakeCells[0].type = 'head';
}

const changeHeadCoordinatesWithFieldBorders = (gameData) => {

    switch(gameData.currentDirection){
        case 'right':
            if (gameData.currentHead.X < (gameData.fieldBorderCoordinates.right)) {
                clearField(gameData);
                gameData.currentHead.X += 1;
                rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
                
            } else {
                gameData.gameOver = true;
                console.log('Game Over!');
            }
            break;
        case 'left':
            if (gameData.currentHead.X > (gameData.fieldBorderCoordinates.left)) {
                clearField(gameData);
                gameData.currentHead.X -= 1;
                rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
            } else {
                gameData.gameOver = true;
                console.log('Game Over!');
            }
           break;
        case 'up':
            if (gameData.currentHead.Y > (gameData.fieldBorderCoordinates.top )) {
                clearField(gameData);
                gameData.currentHead.Y -= 1;
                rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
            } else {
                console.log('Game Over!');
                console.dir(gameData.snake.snakeCells);
                gameData.gameOver = true;
            }
           break;
        case 'down':
            if (gameData.currentHead.Y < (gameData.fieldBorderCoordinates.bottom)) {
                clearField(gameData);
                gameData.currentHead.Y += 1;
                rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
            } else {
                console.log('Game Over!');
                gameData.gameOver = true;
            }
           break;
        default:
            break;
    }
}

const changeHeadCoordinatesWithoutFieldBorders = (gameData) => {
    console.log('Current HEAD: ' + 'X: ' + gameData.currentHead.X + ' ' + 'Y: ' + gameData.currentHead.Y);
    switch(gameData.currentDirection){
        case 'right':
            if (gameData.currentHead.X === (gameData.fieldBorderCoordinates.right)) {
                gameData.currentHead.X -= 25;
            }
            clearField(gameData);
            gameData.currentHead.X += 1;
            rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
            break;
        case 'left':
            if (gameData.currentHead.X === (gameData.fieldBorderCoordinates.left)) {
                gameData.currentHead.X += 25;
            }
            clearField(gameData);
            gameData.currentHead.X -= 1;
            rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
           break;
        case 'up':
            if (gameData.currentHead.Y === (gameData.fieldBorderCoordinates.top )) {
                gameData.currentHead.Y += 25;
            }
            clearField(gameData);
            gameData.currentHead.Y -= 1;
            rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
           break;
        case 'down':
            if (gameData.currentHead.Y === (gameData.fieldBorderCoordinates.bottom)) {
                gameData.currentHead.Y -= 25;
            }
            clearField(gameData);
            gameData.currentHead.Y += 1;
            rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
           break;
        default:
            break;
        }
    console.log('END: '  + 'X: ' + gameData.currentHead.X + ' ' + 'Y: ' + gameData.currentHead.Y);
}

const translateCoordinatesToIndex = (currentHead) => {
    return (currentHead.X + (currentHead.Y) * FIELD_WIDTH )
} // checked

const translateCoordinatesToNumber = (X = 0, Y = 0) => {
    if(X === 0 && Y === 0){
        return 0;
    }
    if(X !== 0 && Y !== 0){
        return (X + (Y) * FIELD_WIDTH);
    }
    if(X !== 0 && Y === 0){
        return X;
    }
    if(X === 0 && Y !== 0){
        return (Y * FIELD_WIDTH);
    }
    
} // checked


// const fieldCell = document.querySelectorAll('field__cell');


const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} // checked

const setStartCoordinates = (gameData, generateRandNum = generateRandomNumber) => {
    gameData.currentHead.X = generateRandNum(START_SNAKE_SIZE,FIELD_WIDTH - START_SNAKE_SIZE);
    gameData.currentHead.Y = generateRandNum(START_SNAKE_SIZE,FIELD_HEIGHT - START_SNAKE_SIZE);
    console.log("Set start coordinates: " + gameData.currentHead.X + ' ' + gameData.currentHead.X + " Translated: " + translateCoordinatesToIndex(gameData.currentHead)) // TEMP
    
} // checked

const generateRandomDirection = (gameData, generateRandNum = generateRandomNumber) => {
    switch (generateRandNum(1, 4)) {
        case 1:
            gameData.currentDirection = 'right';
            break;
        case 2:
            gameData.currentDirection = 'left';
            break;
        case 3:
            gameData.currentDirection = 'up';
            break;
        case 4:
            gameData.currentDirection = 'down';
            break;
        default:
            break;
    }
} // checked

const spawnApple = (gameData) => {
    gameData.apple.X = generateRandomNumber(0,FIELD_WIDTH-1);
    gameData.apple.Y = generateRandomNumber(0,FIELD_HEIGHT-1);
    let coordinate = translateCoordinatesToIndex(gameData.apple);
    for(let index = 0; index < gameData.snake.snakeCells.length; index++ ){
        if(coordinate  === gameData.snake.snakeCells[index].coordinate){
            spawnApple(gameData);
        }
    }
    // gameData.field[translateCoordinatesToNumber(gameData.apple.X, gameData.apple.Y)].fieldPart = 'apple';
} // checked

const spawnSnake = (gameData) => {

    gameData.snake.snakeCells[0].type = 'head';
    gameData.snake.snakeCells[0].coordinate = translateCoordinatesToIndex(gameData.currentHead);
    
    switch (gameData.currentDirection) {
        case 'right':
            for(let index = 1; index < START_SNAKE_SIZE; index++){
                gameData.snake.snakeCells[index].type = 'body';
                gameData.snake.snakeCells[index].coordinate = translateCoordinatesToIndex(gameData.currentHead) - index;
                
            }
            break;
        case 'left':
            for(let index = 1; index < START_SNAKE_SIZE; index++){
                gameData.snake.snakeCells[index].type = 'body';
                gameData.snake.snakeCells[index].coordinate = translateCoordinatesToIndex(gameData.currentHead) + index;
            }
            break;
        case 'up':
        for(let index = 1; index < START_SNAKE_SIZE; index++){
                gameData.snake.snakeCells[index].type = 'body';
                gameData.snake.snakeCells[index].coordinate = translateCoordinatesToIndex(gameData.currentHead) +
                translateCoordinatesToNumber(0,index);
            }
            break;
        case 'down':
            for(let index = 1; index < START_SNAKE_SIZE; index++){
                gameData.snake.snakeCells[index].type = 'body';
                gameData.snake.snakeCells[index].coordinate = translateCoordinatesToIndex(gameData.currentHead) -
                translateCoordinatesToNumber(0,index);
            }
            break;
        default:
            break;
    }
}




const syncSnakeWithField = (gameData) => {
    gameData.snake.snakeCells.forEach((element) => {
        gameData.field[element.coordinate].fieldPart = element.type;
    });
    // gameData.field[translateCoordinatesToIndex(gameData.apple)].fieldPart = 'apple';
    
} //BAD_FUNC

const clearDisplayedField = (gameData) => {
    const fieldCell = document.querySelectorAll('.field__cell');

    gameData.field.forEach((element, index) => {
        // if(fieldCell[index].classList.contains('snake__head')){
        //     fieldCell[index].classList.remove('snake__head');
        // }
        // if(fieldCell[index].classList.contains('snake__body')){
        //     fieldCell[index].classList.remove('snake__body');
        // }
        // if(fieldCell[index].classList.contains('apple')){
        //     fieldCell[index].classList.remove('apple');
        // }
        fieldCell[index].classList.remove('snake__head');
        fieldCell[index].classList.remove('snake__body');
        fieldCell[index].classList.remove('apple');
    });
}

const renderField = (gameData) => {
    
    const fieldCell = document.querySelectorAll('.field__cell');
    clearDisplayedField(gameData);
    gameData.field.forEach((element, index) => {
        
        if(element.fieldPart === 'head') {
            fieldCell[index].classList.add('snake__head');
        }
        if(element.fieldPart === 'body') {
            fieldCell[index].classList.add('snake__body');
        }
        if(element.fieldPart === 'apple') {
            fieldCell[index].classList.add('apple');
        }
        // if(fieldCell[index].classList.contains('snake__body') &&
        //  fieldCell[index].classList.contains('snake__head')){
        //     fieldCell[index].classList.remove('snake__body');
        // }
    });
} //checked

const updateScore = (gameData) => {
    const score = document.querySelector('.score__number');
    score.textContent = `${gameData.score}`;
}

const addSnakePart = (gameData) => {
    let coordinate = translateCoordinatesToIndex(gameData.currentHead);
    gameData.snake.snakeCells.unshift({
        
        coordinate: coordinate,
    })
}


const onApple = (gameData) => {
    console.log("ON APPLE!!!")
    addSnakePart(gameData);
    gameData.score++;
    updateScore(gameData);
    spawnApple(gameData);
}

const checkIsCross = (snakeCells) => {
    for(let index = 1; index < snakeCells.length; index++ ){
        if(snakeCells[0].coordinate  === snakeCells[index].coordinate){
                return true;
        }   
    }
    return false;
}

const updateGame = () => {
    if(!gameData.gameOver){
        
        gameData.field[translateCoordinatesToIndex(gameData.apple)].fieldPart = 'apple';
        listenButton(gameData);
        // changeHeadCoordinatesWithFieldBorders(gameData);
        changeHeadCoordinatesWithoutFieldBorders(gameData);
        syncSnakeWithField(gameData);   
        renderField(gameData);

        if(checkIsCross(gameData.snake.snakeCells)){
            gameData.gameOver = true;
            console.log("TRUE")
        }else{
            console.log("FALSE")
        }

        if(isOnApple(gameData)){
            onApple(gameData);
        }
    }
} // checked

const isOnApple = (gameData) => {
    if((translateCoordinatesToIndex(gameData.apple)) === translateCoordinatesToIndex(gameData.currentHead)) {
        return true;
    } else{
        return false;
    }
    
} // cheked

// const onApple = (gameData) => {
    
    
    
// }

// Game Process
spawnApple(gameData);

generateRandomDirection(gameData);
setStartCoordinates(gameData);

// listenButton(gameData);
// syncSnakeWithField(gameData)
spawnSnake(gameData);
renderField(gameData);


setInterval(updateGame, UPDATE_TIME);

// updateGame(gameData);

// Game Process




const updateTimeForm = document.querySelector("update__time_form");
updateTimeForm.textContent = 'hello';
console.log(updateTimeForm);

