/*
const express = require('express');
const pixi = require('pixi.js');
*/
const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
const grid = new PixiJSGrid(window.innerWidth,63);
//const grid = new PixiJSGrid(width).drawGrid();
const socket = io();

var playerList = [];
let gameID;// = document.getElementById('copy-invite-button').innerText;
var playerID = name;
// Temporary variable, will be replaced with username when it becomes available.
var playerNum;

function CopyToClipboard () {
    /* Get the text field */
  var copyText = document.getElementById("copy-invite-button");

  /* Select the text field */
  //copyText.select();
  //copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.href);
  
  /* Alert the copied text */
  alert("Copied the text: " + copyText.href);
    
    /*
    const link = document.querySelector('#copy-invite-button');
    var range = document.createRange();
    range.selectNode(link);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");//method is deprecated need alternative!!!!
    alert("text copied");
    */
}

function startGame(){
    console.log('Start game has been pressed');
}


$(document).ready(function(){

    // Check if user came through the create button or joined. 
    if (gameID == undefined){
        socket.emit('create-room', "");
        UpdatePlayerList(1);
        playerNum = 1;
    }
    // When the else fires. Client will emit a request that adds them to the room. 
    // The server will respond with an emit to all current players updating player list 
    else {
        socket.emit('join-room', {gameID: gameID, username: 'username'});
    }

    $("#game-app").append(app.view);

    grid.drawGrid();
    app.stage.addChild(grid);
});

socket.on('room-created', id => {
    gameID = id;

    //Update fields with generated game room info
    //document.getElementById('copy-invite-button').innerText = gameID;
    document.getElementById('copy-invite-button').href = '/game/join?id=' + gameID;
    
    $("#copy-invite-button").append();

    console.log(`Player ${playerNum} has joined game #${gameID}`);
});

// Should update page info to reflect current status.
socket.on('room-joined', (data) => {
    const {id, count} = data
    // Update player list. 
    playerNum = count;

    console.log(`Player ${playerNum} has joined game #${gameID}`);
});

//
socket.on('update-player-list', count =>{
    UpdatePlayerList(count);
})

function ready(){
    console.log('Ready has been pressed');
    socket.emit('ready', {gameID: gameID, playerID: playerNum});
}

socket.on('update-player-status', playerNum =>{
    console.log(`Player ${playerNum} is ready`);
    $("#player-" + playerNum + "S").replaceWith("<td id=&quot;player-"+ playerNum + "S&quot;>Ready</td>");
});

// Currently incomplete
function UpdatePlayerList (count) {
    for (let i = 1; i <= count; i++){
        $("#player-" + i).replaceWith("<td id=player-" + i + ">Player " + i + "</td>");
        $("#player-" + i + "S").replaceWith("<td id=player-"+ i + "S>Not Ready</td>");
    }
}



//const container = new PIXI.Container();
//app.stage.addChild(container);



/*app.ticker.add(delta=> loop(delta));

function loop (delta) {
    let squ = new PIXI.Graphics();
    squ.beginFill(0xff0000);
    squ.drawRect(Math.random() * app.screen.width,Math.random() * app.screen.height,10,10);
    squ.endFill();
    app.stage.addChild(squ);
}*/

const loader = PIXI.Loader.shared;

const shapesTileSheet = [
    'images/circlespritesheet.json'
    ,'images/crossspritesheet.json'
    ,'images/diamondspritesheet.json'
    ,'images/squarespritesheet.json'
    ,'images/starspritesheet.json'
    ,'images/trianglespritesheet.json'
];

let yPositon = 0;
let xPosition = 0;

/*
function setup(loader,resources){
    const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
    const shapes = ['Circle','Square','Triangle','Star','Diamond','Cross'];
     let xPosition = 0;
     
    for (let i = 0; i < 3; i++){
        for (shape in shapes){
            for (color in colors){
                const texture = PIXI.Texture.from(`${shapes[shape]}${colors[color]}Tile.png`);
                const sprite = new PIXI.Sprite(texture);
    
                sprite.position.set(xPosition,yPositon);
                xPosition+=63;
    
                sprite.interactive = true; 
                sprite.buttonMode = true; 
                sprite.anchor.set = 0.5; 
    
                sprite.on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);
    
                app.stage.addChild(sprite);
            }
            yPositon += 63;
            xPosition = 0; 
        }
    }
}
*/

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

let tileTracker = {
    star: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    cross: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    diamond: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    triangle: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    square: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    circle: {
        red:0,
        blue:0,
        orange:0,
        purple:0,
        green:0,
        yellow:0
    },
    totalInPlay:0
}

let selectedColor;
let selectedShape;

function getTileAtRandom(){
    const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
    const shapes = ['Circle','Cross','Diamond','Square','Star','Triangle'];

    let colorIdx = Math.floor(Math.random() * 5);
    let shapeIdx = Math.floor(Math.random() * 5);

    selectedColor = colors[colorIdx];
    selectedShape = shapes[shapeIdx];

    const shapesTileSheet = [
        'images/circlespritesheet.json'
        ,'images/crossspritesheet.json'
        ,'images/diamondspritesheet.json'
        ,'images/squarespritesheet.json'
        ,'images/starspritesheet.json'
        ,'images/trianglespritesheet.json'
    ];

    console.log(`ColorIdx: ${colorIdx} ShapeIdx: ${shapeIdx},${shapesTileSheet[shapeIdx]}`);
    
    if (checkTileAvailablity(shapes[shapeIdx].toLowerCase(),colors[colorIdx].toLowerCase())) {
        loader.add(shapesTileSheet[shapeIdx]);
        loader.load(drawTile);
    } else if(allTilesInPlay) {
        alert('There are no more tiles to be drawn');
    }

}

function drawTile (loader, resources) {
    console.log(resources);
    tileTracker[selectedShape.toLowerCase()][selectedColor.toLowerCase()] += 1;
    console.log('tileTRACKER: '+tileTracker[selectedShape.toLowerCase()][selectedColor.toLowerCase()]);
    const texture = PIXI.Texture.from(`${selectedShape}${selectedColor}Tile.png`);
    const sprite = new PIXI.Sprite(texture);

    sprite.position.set(xPosition,yPositon);
    xPosition+=63;

    sprite.interactive = true; 
    sprite.buttonMode = true; 
    sprite.anchor.set = 0.5; 

    sprite.on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

    app.stage.addChild(sprite);
    loader.reset();
}

function checkTileAvailablity(shape,color){
    return tileTracker[shape][color] < 3;
}

function allTilesInPlay(){
    return tileTracker.totalInPlay == 108;
}

// throughout the process multiple signals can be dispatched.
loader.onProgress.add(() => {console.log('loader in progress')}); // called once per loaded/errored file
loader.onError.add(() => {console.log('an error')}); // called once per errored file
loader.onLoad.add(() => {console.log('loading resource')}); // called once per loaded file
loader.onComplete.add(() => {console.log('added resource')}); // called once when the queued resources all load.