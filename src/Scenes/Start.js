class Start extends Phaser.Scene {

    constructor(){
        super("Start");
    }

    preload() {
          
    }

    create() {
        this.background = this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, game.config.height, 'spackBack').setDepth(-1000);
        my.sprite.meteors = this.add.group({
            active: true,
            defaultKey: "platformer_characters",
            defaultFrame: "tile_0024",//"platformer_characters", "tile_0000.png"
            maxSize: 1,
            runChildUpdate: true
            }
        )

        my.sprite.meteors.createMultiple({
            key: "platformer_characters",
            frame: "tile_0000.png",
            classType: screenLoop,
            active: true,
            key: my.sprite.meteors.defaultKey,
            repeat: my.sprite.meteors.maxSize-1,
        });
        my.sprite.meteors.scaleXY(3);

        //game.scene.stop('GameOver');
        //game.scene.start('Start');

        
        //my.sprite.rst = this.add.text(0, 0, 'Press Enter to Restart', { fontFamily: 'font1', fontSize: '40px', fill: '#000000', stroke: '#FFFFFF', strokeThickness: 10 }).setOrigin(.5).setPosition(game.config.width/2, game.config.height - 150).setDepth(1).setAngle(20);


        this.tweens.add({
            targets     : my.sprite.rst,
            angle      : -20,
            ease        : 'Cubic.In',
            duration    : 600,
            repeat: -1,
            yoyo: true
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            game.scene.stop('Start');
            game.scene.start('platformerScene');
        }, this);
        this.input.keyboard.on('keydown-SPACE', () => {
            game.scene.stop('Start');
            game.scene.start('platformerScene');
        }, this);
        this.runOncey = false;
    }

    update() {
        this.background.tilePositionY -= .5;
        this.background.tilePositionX -= .2;
        this.sound.unlock();
        if (!this.runOncey) {
            this.runOnce();
            this.runOncey = true;
        }

    }

    runOnce() {
        my.bgm = this.sound.add("music");
        my.sprite.gO = this.add.text(0, 0, "You're an alien.", { fontFamily: 'font1', fontSize: '40px', fill: '#5ad28c', stroke: '#FFFFFF', strokeThickness: 14 }).setOrigin(.5).setPosition(game.config.width/2, 60).setScale(50);
        this.tweens.add({
            targets     : my.sprite.gO,
            scale     : 1,
            ease        : 'Cubic.In',
            duration    : 500,
            onComplete: () => {
                this.sound.play("bwah"); 
            }
        });
        my.sprite.g1 = this.add.text(0, 0, "You're about to explode.", { fontFamily: 'font1', fontSize: '38px', fill: '#5ad28c', stroke: '#FFFFFF', strokeThickness: 13 }).setOrigin(.5).setPosition(game.config.width/2, 200).setScale(50).setVisible(false);
        this.tweens.add({
            delay: 1500,
            targets     : my.sprite.g1,
            onStart: () => {
                my.sprite.g1.visible = true; 
            },
            scale     : 1,
            ease        : 'Cubic.In',
            duration    : 500,
            onComplete: () => {
                this.sound.play("bwah"); 
            }
        });
        my.sprite.g2 = this.add.text(0, 0, "Get in water so you don't.", { fontFamily: 'font1', fontSize: '38px', fill: '#5ad28c', stroke: '#FFFFFF', strokeThickness: 14 }).setOrigin(.5).setPosition(game.config.width/2, 360).setScale(50).setVisible(false);
        this.tweens.add({
            delay: 3000,
            targets     : my.sprite.g2,
            onStart: () => {
                my.sprite.g2.visible = true;  
            },
            scale     : 1,
            ease        : 'Cubic.In',
            duration    : 500,
            onComplete: () => {
                this.sound.play("bwah"); 
            }
        });
        my.sprite.g3 = this.add.text(0, 0, "You have 999 seconds.", { fontFamily: 'font1', fontSize: '38px', fill: '#5ad28c', stroke: '#FFFFFF', strokeThickness: 12 }).setOrigin(.5).setPosition(game.config.width/2, 520).setScale(50).setVisible(false);
        this.tweens.add({
            delay: 4500,
            targets     : my.sprite.g3,
            onStart: () => {
                my.sprite.g3.visible = true;  
            },
            scale     : 1,
            ease        : 'Cubic.In',
            duration    : 500,
            onComplete: () => {
                this.sound.play("bwah"); 
            }
        });
        my.sprite.g4 = this.add.text(0, 0, "Have fun :P", { fontFamily: 'font1', fontSize: '38px', fill: '#5ad28c', stroke: '#FFFFFF', strokeThickness: 12 }).setOrigin(.5).setPosition(game.config.width/2, 640).setScale(50).setVisible(false);
        this.tweens.add({
            delay: 6000,
            targets     : my.sprite.g4,
            onStart: () => {
                my.sprite.g4.visible = true;  
            },
            scale     : 1,
            ease        : 'Cubic.In',
            duration    : 500,
            onComplete: () => {
                this.sound.play("bwah"); 
            }
        });
        this.time.delayedCall(
            7500,                // ms
            ()=>{
                game.scene.stop('Start');
                game.scene.start('platformerScene');
        });
    }
}