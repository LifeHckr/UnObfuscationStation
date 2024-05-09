class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 80;
        this.RUNMULTI = 3;
        this.RUNTHRESHOLD = 500;
        this.STARTVELOCITY = 300;
        this.MAXVELOCITYX = 1000;
        this.MAXVELOCITYY = 1000;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1900;
        this.JUMP_VELOCITY = -675;
        this.TEMP_JUMPVELOCITY = -1965;
        this.worldBoundsX = 2 * 18 * (90); //scale = 2, 18 = width of tile, x = num tiles
        this.worldBoundsY = 2 * 18 * (25) + 200;
        my.camera = this.cameras.main;
        
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

        
    }

    create() {
//TILEMAP--------------------------------------------------------------
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        //groundLayer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        //topLayer
        this.topLayer = this.map.createLayer("Above-Ground", this.tileset, 0, 0);
        this.topLayer.setScale(2.0);
        this.topLayer.setAlpha(.8).setDepth(1);
        this.animatedTiles.init(this.map);

        //Collection ???
//-----------------------------------------------------------------------------

// Player---------------------------------
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/3, "platformer_characters", "tile_0000.png").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, -200, this.worldBoundsX, this.worldBoundsY, 64, true, true, false, true);
        // Enable collision handling
        /*my.groundCollider = this.physics.add.collider(my.sprite.player, this.groundLayer, null, 
            function (player, layer) {
                return my.sprite.player.body.velocity.y > 0; 
            }
        );*/
        my.groundCollider = this.physics.add.collider(my.sprite.player, this.groundLayer);

        my.sprite.player.body.setMaxVelocity(this.MAXVELOCITYX, this.MAXVELOCITYY);

        my.sprite.player.moving = false;
        my.sprite.player.running = 1;
        my.sprite.player.facing = enumList.RIGHT;
        my.sprite.player.air = enumList.GROUNDED;
        my.sprite.player.animating = false;
        my.bumpTimed = false;
        //my.sprite.player.doubleJump = true;
//-----------------------------------------------

// Controls
        cursors = this.input.keyboard.createCursorKeys();
        my.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        my.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        my.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-X', () => {
            
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.input.keyboard.on('keydown-L', () => {
            console.log(my.sprite.player.body.velocity);
        }, this);
//--------------------------------------

//Camera------------------------------------
        my.camera.startFollow(my.sprite.player);
        my.camera.width = 1200;
        my.camera.height = 700;
        //doesnt work this.displayHeight = my.camera.height;
        //this.displayWidth = my.camera.Width;
        my.camera.setViewport(0, 0, 1200, 700);
        my.camera.setBounds(0, -200, this.worldBoundsX, this.worldBoundsY);
//-----------------------------------------

//Tweens
    
//---------------------------------------------
//Particles?------------------------------------
        
//-----------------------------------------------
    }

    update() {

//SCHMOOVEMENT
        if (my.sprite.player.animating) {

        } else if ((cursors.left.isDown || my.keyA.isDown) == (cursors.right.isDown || my.keyD.isDown)) {
            if (Math.abs(my.sprite.player.body.velocity.x) < this.RUNTHRESHOLD) {
                my.sprite.player.anims.play('idle');
                my.sprite.player.running = 1;
            }
            
            if (Math.abs(my.sprite.player.body.deltaAbsX() < 20 && my.sprite.player.air == enumList.GROUNDED) ) {
                my.sprite.player.body.setDragX(2.2*this.DRAG);
                my.sprite.player.moving = false;
                //my.sprite.player.running = 1;
                my.sprite.player.body.setAngularVelocity(0);
            } else if (Math.abs(my.sprite.player.body.deltaAbsX() < 10 && my.sprite.player.air != enumList.GROUNDED)) {
                my.sprite.player.body.setDragX(this.DRAG);
                my.sprite.player.moving = false;
                //my.sprite.player.running = 1;
                my.sprite.player.body.setAngularVelocity(0);
            }
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG * 1.5);
            //my.sprite.player.anims.play('idle');
            
        } else {
            if(cursors.left.isDown || my.keyA.isDown) {
                if (my.sprite.player.facing == enumList.LEFT && my.sprite.player.moving) {
                    my.sprite.player.facing = enumList.RIGHT;
                    if (my.sprite.player.running > 1 && !my.sprite.player.animating) {
                        my.sprite.player.animating = true;
                        this.time.addEvent({
                            delay: 100,                // ms
                            callback: ()=>{
                                my.sprite.player.body.setVelocityX(-1*my.sprite.player.body.velocity.x);
                                my.sprite.player.animating = false;
                                my.sprite.player.body.velocity.y += 70;
                            },
                            
                            loop: false
                        });
                    } else {
                        my.sprite.player.body.setVelocityX(-.9*my.sprite.player.body.velocity.x);

                    }
                }
                if (!my.sprite.player.moving) {  
                    my.sprite.player.facing = enumList.RIGHT;  
                    my.sprite.player.body.setVelocityX(-this.STARTVELOCITY);                
                    
                }
                if (Math.abs(my.sprite.player.body.velocity.x) <= Math.abs(this.STARTVELOCITY)) {
                    my.sprite.player.body.setVelocityX(-this.STARTVELOCITY);
                }
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION * my.sprite.player.running);
                my.sprite.player.resetFlip();
                //my.sprite.player.anims.play('walk', true);
    
            }
            if(cursors.right.isDown || my.keyD.isDown) {
                if (my.sprite.player.facing == enumList.RIGHT && my.sprite.player.moving) {
                    my.sprite.player.facing = enumList.LEFT;
                    if (my.sprite.player.running > 1 && !my.sprite.player.animating) {
                        my.sprite.player.animating = true;
                        this.time.addEvent({
                            delay: 100,                // ms
                            callback: ()=>{
                                my.sprite.player.body.setVelocityX(-1*my.sprite.player.body.velocity.x);
                                my.sprite.player.animating = false;
                                my.sprite.player.body.velocity.y += 70;
                                
                            },
                            
                            loop: false
                        });
                    } else {
                        my.sprite.player.body.setVelocityX(-.9*my.sprite.player.body.velocity.x);

                    }
                }
                if (!my.sprite.player.moving) {
                    
                    my.sprite.player.body.setVelocityX(this.STARTVELOCITY);
                    my.sprite.player.facing = enumList.LEFT;
                }
                if (Math.abs(my.sprite.player.body.velocity.x) <= Math.abs(this.STARTVELOCITY)) {
                    my.sprite.player.body.setVelocityX(this.STARTVELOCITY);
                }
                
                my.sprite.player.body.setAccelerationX(this.ACCELERATION * my.sprite.player.running);
    
                my.sprite.player.setFlip(true, false);
                //my.sprite.player.anims.play('walk', true);
    
            }
            my.sprite.player.moving = true;
            my.sprite.player.body.setAngularVelocity(my.sprite.player.body.velocity.x);
            if (Math.abs(my.sprite.player.body.velocity.x) > this.RUNTHRESHOLD) {
                my.sprite.player.running = this.RUNMULTI;
                my.sprite.player.anims.play('fast');
            }
            if (my.sprite.player.running > 1 && Math.abs(my.sprite.player.body.velocity.x) <= this.RUNTHRESHOLD) {
                if (!my.bumpTimed) {
                    //console.log("test");
                    my.bumpTimed = true;
                    my.bumpTime = this.time.addEvent({
                        delay: 100,                // ms
                        callback: function () {
                            if (my.sprite.player.body.blocked.right || my.sprite.player.body.blocked.left) {
                                my.sprite.player.running = 1;
                                my.sprite.player.anims.play('idle');
                                //console.log("test2");
                            }
                            my.bumpTimed = false;
                        },
                    });
                }
                

            }
        }
         
        

        // PLAYER JUMP
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (my.sprite.player.animating) {

        } else if(!my.sprite.player.body.blocked.down) {
            if (my.sprite.player.running > 1) {
                my.sprite.player.anims.play('fastJump');
            } else {
                my.sprite.player.anims.play('jump');
            }
            
            if (my.sprite.player.air == enumList.GROUNDED) {
                my.coyoteTimer = this.time.delayedCall(
                    134,                // ms
                    ()=>{
                        my.sprite.player.air = enumList.NOJUMP
                    });
            } else if (my.sprite.player.air == enumList.INAIR || my.sprite.player.air == enumList.NOJUMP) {
                my.sprite.player.body.setAccelerationY(0);
            }
            
        }
        if(my.sprite.player.body.blocked.down) {
            if (my.sprite.player.air != enumList.GROUNDED) {
                
                //Fall Tween
                this.tweens.add({
                    onUpdate: function () {my.sprite.player.setBodySize(24 *(2/my.sprite.player.scaleX), 24*(2/my.sprite.player.scaleY))},
                    targets     : my.sprite.player,
                    scaleY      : 1.3,
                    ease        : 'Quart.Out',
                    duration    : 100,
                    yoyo: true,
                    onYoyo: function () {console.log(my.sprite.player.scaleY)},
                    onComplete: function () {
                        my.sprite.player.setBodySize(24, 24); 
                        my.sprite.player.scale = 2;
                    },
                });

                
            }
            
            my.sprite.player.air = enumList.GROUNDED;
            //my.sprite.player.doubleJump = true;
            
        }

        if((my.sprite.player.air != enumList.NOJUMP /*|| my.sprite.player.doubleJump*/) && (cursors.up.isDown||my.keySpace.isDown)) {
            
            //console.log(my.sprite.player.doubleJump);
            //console.log(my.sprite.player.air == enumList.NOJUMP);
            if (my.sprite.player.air == enumList.GROUNDED) {
                my.sprite.player.air = enumList.INAIR;
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                //jump particle
                this.add.particles(my.sprite.player.x, my.sprite.player.y+my.sprite.player.displayHeight/1.9, 'particle', { 
                    angle: { min: 0, max: 360 },
                    radial: true,
                    delay: 10,
                    active: true,
                    speed: 100,
                    lifespan: 110,
                    quantity: 7,
                    scale: { start: 1, end: 0 },
                    emitting: true,
                    emitZone: { type: 'random', source: my.sprite.player, quantity:100 },
                    duration: 40,
                    //speedX: 100
                });
                
                //Jump Tween
                this.tweens.add({
                    onUpdate: function () {my.sprite.player.setBodySize(24 *(2/my.sprite.player.scale), 24*(2/my.sprite.player.scale))},
                    targets     : my.sprite.player,
                    scale      : 3,
                    ease        : 'Bounce.In',
                    duration    : 100,
                    yoyo: true,
                    
                    onComplete: function () {
                        my.sprite.player.setBodySize(24, 24); 
                        my.sprite.player.scale = 2;
                    },
                });
                
                
                

                my.sillyTime = this.time.delayedCall(
                    130,                // ms
                    ()=>{
                        my.sprite.player.air = enumList.NOJUMP
                    });
                
            } /*else if (my.sprite.player.air == enumList.NOJUMP && my.sprite.player.doubleJump) {
                my.sprite.player.doubleJump = false;
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY/2);
            }*/
            if (my.sprite.player.air == enumList.INAIR) {
                my.sprite.player.body.setAccelerationY(this.TEMP_JUMPVELOCITY);
                
            }

        }
        my.sprite.player.body.setAllowGravity(!my.sprite.player.animating);

        if (my.sprite.player.moving && my.sprite.player.air == enumList.GROUNDED && Math.abs(my.sprite.player.body.velocity.x) > 700 /*&& !my.sprite.player.body.blocked.left && !my.sprite.player.body.blocked.right*/) {
            //run particle
            
            this.add.particles(my.sprite.player.x, my.sprite.player.y+my.sprite.player.displayHeight/1.9, 'particle', { 
                active: true,
                speedX: 100,
                speedY: -40,
                lifespan: (Math.abs(my.sprite.player.body.velocity.x)-500)/5,
                quantity: 2,
                rotate: { min: 160, max: 200 },
                
                scale: { start: .5, end: 2 },
                alpha: { start: .4, end: 0 },
                emitting: true,
                emitZone: { type: 'edge', source: my.sprite.player, quantity:2 },
                duration: 10
                //speedX: 100
            });
        }
    }
//----------------------------------------------------
}