// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    //fps: { forceSetTimeOut: true, target: 60 },
    physics: {
        default: 'arcade',
        type: Phaser.WEBGL,
        arcade: {
            //debug: true,
            fps: 30,
            fixedstep: true,
            tileBias: 64,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1200,
    height: 700,
    scene: [Load, Platformer]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}};
const enumList = {
    RIGHT: 1,
    LEFT: -1,
    JUMPING: 2,
    GROUNDED: 3,
    INAIR: 4,
    NOJUMP: 5
};

const game = new Phaser.Game(config);
