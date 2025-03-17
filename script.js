// SETTINGS
const FIELD_WIDTH = 25;
const FIELD_HEIGHT = 25;
const FIELD_SIZE = FIELD_HEIGHT * FIELD_WIDTH;
const START_SNAKE_SIZE = 5;
const UPDATE_TIME = 50;
const CHECK_CROSS = true;
const FIELD_BORDERS = true;

// SETTINGS

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
        coordinate: '',
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

const restartButton = document.querySelector('.restart__button');



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
    clearField(gameData);
    switch(gameData.currentDirection){
        case 'right':
            if (gameData.currentHead.X < (gameData.fieldBorderCoordinates.right)) {
                
                gameData.currentHead.X += 1;
            } else {
                gameData.gameOver = true;
                console.log('Game Over!');
            }
            break;
        case 'left':
            if (gameData.currentHead.X > (gameData.fieldBorderCoordinates.left)) {
                gameData.currentHead.X -= 1;
            } else {
                gameData.gameOver = true;
                console.log('Game Over!');
            }
           break;
        case 'up':
            if (gameData.currentHead.Y > (gameData.fieldBorderCoordinates.top )) {
                gameData.currentHead.Y -= 1;
            } else {
                console.log('Game Over!');
                console.dir(gameData.snake.snakeCells);
                gameData.gameOver = true;
            }
           break;
        case 'down':
            if (gameData.currentHead.Y < (gameData.fieldBorderCoordinates.bottom)) {
                gameData.currentHead.Y += 1;
            } else {
                console.log('Game Over!');
                gameData.gameOver = true;
            }
           break;
           default:
               break;
        }

        if (gameData.gameOver === false) {
            rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
        }
        console.log("Switch ended!");
        
}

const changeHeadCoordinatesWithoutFieldBorders = (gameData) => {
    console.log('Current HEAD: ' + 'X: ' + gameData.currentHead.X + ' ' + 'Y: ' + gameData.currentHead.Y);
    clearField(gameData);
    switch(gameData.currentDirection){
        case 'right':
            if (gameData.currentHead.X === (gameData.fieldBorderCoordinates.right)) {
                gameData.currentHead.X -= 25;
            }
            gameData.currentHead.X += 1;
            break;
        case 'left':
            if (gameData.currentHead.X === (gameData.fieldBorderCoordinates.left)) {
                gameData.currentHead.X += 25;
            }
            gameData.currentHead.X -= 1;
           break;
        case 'up':
            if (gameData.currentHead.Y === (gameData.fieldBorderCoordinates.top )) {
                gameData.currentHead.Y += 25;
            }
            gameData.currentHead.Y -= 1;
           break;
        case 'down':
            if (gameData.currentHead.Y === (gameData.fieldBorderCoordinates.bottom)) {
                gameData.currentHead.Y -= 25;
            }
            gameData.currentHead.Y += 1;
            break;
        default:
            break;
    }
    if (gameData.gameOver === false) {
        rewriteSnakeCoordinates(gameData.snake.snakeCells, translateCoordinatesToIndex(gameData.currentHead));
    }      console.log('END: '  + 'X: ' + gameData.currentHead.X + ' ' + 'Y: ' + gameData.currentHead.Y);
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
} //BAD_FUNC

const clearDisplayedField = (gameData) => {
    const fieldCell = document.querySelectorAll('.field__cell');

    gameData.field.forEach((element, index) => {
        fieldCell[index].classList.remove('snake__head');
        fieldCell[index].classList.remove('snake__body');
        fieldCell[index].classList.remove('apple');
    });
}

const renderField = (gameData) => {
    
    clearDisplayedField(gameData);
    const fieldCells = document.querySelectorAll('.field__cell');
    gameData.field.forEach((element, index) => {
        
        if(element.fieldPart === 'body') {
            fieldCells[index].classList.remove('snake__head');
            fieldCells[index].classList.remove('apple');
            fieldCells[index].classList.add('snake__body');
        }
        if(element.fieldPart === 'head') {
            fieldCells[index].classList.remove('snake__body');
            fieldCells[index].classList.remove('apple');
            fieldCells[index].classList.add('snake__head');
        }
        if(element.fieldPart === 'apple') {
            fieldCells[index].classList.remove('snake__head');
            fieldCells[index].classList.remove('snake__body');
            fieldCells[index].classList.add('apple');
        }
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
const restartGame = () => {
    location.reload();
}
const startGame = () => {

    const restartButton = document.querySelector('.restart__button');
    const gameOverInner = document.querySelector('.gameOver__inner');
    gameOverInner.classList.add('hide');

    spawnApple(gameData);
    clearField(gameData);
    generateRandomDirection(gameData);
    setStartCoordinates(gameData);
    spawnSnake(gameData);
    syncSnakeWithField(gameData);
    renderField(gameData);
    setInterval(updateGame, UPDATE_TIME);

}


const updateGame = () => {
    if(!gameData.gameOver){
        if(FIELD_BORDERS === true){
            changeHeadCoordinatesWithFieldBorders(gameData);
        }else{
            changeHeadCoordinatesWithoutFieldBorders(gameData);
        }
        gameData.field[translateCoordinatesToIndex(gameData.apple)].fieldPart = 'apple';
        listenButton(gameData);
        
        syncSnakeWithField(gameData);
        renderField(gameData);
        if(checkIsCross(gameData.snake.snakeCells) && CHECK_CROSS === true){
            gameData.gameOver = true;
        }
        
        
        if(isOnApple(gameData)){
            onApple(gameData);
        }
        
    } else {
        restartButton.addEventListener("click", restartGame);
        restartButton.classList.remove('hide');
        const gameOverInner = document.querySelector('.gameOver__inner');
        // gameOverInner.classList.remove('hide');

    }
} // checked

const isOnApple = (gameData) => {
    if((translateCoordinatesToIndex(gameData.apple)) === translateCoordinatesToIndex(gameData.currentHead)) {
        return true;
    } else{
        return false;
    }
    
} // cheked




// Game Process

startGame();



// Game Process




// const updateTimeForm = document.querySelector("update__time_form");
// updateTimeForm.textContent = 'hello';
// console.log(updateTimeForm);

