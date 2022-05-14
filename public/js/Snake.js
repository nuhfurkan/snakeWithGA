export default class Snake {
    constructor(scene) {
        this.scene = scene;
        this.height = this.scene.game.config.height;
        this.width = this.scene.game.config.width;
        // set size of box here
        this.sizeOfBox = 16
        this.lastMoveTime = 0;
        // set initial speed here
        this.moveTimeInterval = 220;
        this.myVelocity = 30
        // set initial direction here
        this.direction = Phaser.Math.Vector2.RIGHT;
        this.body = [];
        this.visiblebody = []
        // set initial position and head color here 
        var head = this.scene.add.rectangle(this.width / 2, this.height / 2, this.sizeOfBox, this.sizeOfBox, 0x0000ff).setOrigin(0);
        this.body.push(head);

        var mySprite = this.scene.add.sprite(0, 0, "headUp").setOrigin(0);
        this.visiblebody.push(mySprite);

        //this.body.push(this.scene.add.rectangle(this.width / 2, this.height / 2, this.sizeOfBox, this.sizeOfBox, 0x0000ff).setOrigin(0));
        scene.input.keyboard.on("keydown",  e => {
            this.keydown(e);
        })
        // apple object
        // set apple color here
        this.apple = this.scene.add.rectangle(0, 0, this.sizeOfBox, this.sizeOfBox, 0xff0000).setOrigin(0);
        this.createApple();
    }   

    // create a random new apple
    createApple() {
        this.apple.x = Math.floor(Math.random() * this.width / this.sizeOfBox) * this.sizeOfBox;
        this.apple.y = Math.floor(Math.random() * this.height / this.sizeOfBox) * this.sizeOfBox;
    }

    // increses the size of snake and speeds it up
    // set tail color here
    snakeGrow() {
        this.body.push(this.scene.add.rectangle(-this.sizeOfBox, -this.sizeOfBox, this.sizeOfBox, this.sizeOfBox, 0x00ff00).setOrigin(0));
        this.visiblebody.push(this.scene.add.sprite(-this.sizeOfBox, -this.sizeOfBox, "body").setOrigin(0));
        this.moveTimeInterval -= 5;
    }

    // listening for the direction
    keydown(event) {
        console.log(event);
        switch(event.keyCode) {
            case 39: // right
                this.direction = Phaser.Math.Vector2.RIGHT;
                break;
            case 37: // left
                this.direction = Phaser.Math.Vector2.LEFT;
                break;
            case 38: // up
                this.direction = Phaser.Math.Vector2.UP;
                break;
            case 40: // down
                this.direction = Phaser.Math.Vector2.DOWN;
                break;
        }
    }

    update(time) {
        if (time >= this.lastMoveTime + this.moveTimeInterval ) {
            this.lastMoveTime = time;
            this.move();
        }
    }

    move() {
        // simulating snake move
        for (var i = this.body.length-1; i > 0; i--) {
            this.body[i].y = this.body[i-1].y    
            this.body[i].x = this.body[i-1].x
            this.visiblebody[i].setY(this.body[i].y);
            this.visiblebody[i].setX(this.body[i].x);
        }
        this.body[0].x += this.direction.x * this.sizeOfBox;
        this.body[0].y += this.direction.y * this.sizeOfBox;
        this.visiblebody[0].setY(this.body[0].y);
        this.visiblebody[0].setX(this.body[0].x);
        if (this.visiblebody.length > 1) {
            this.setHead();
        }
        

        // if apple eaten created another apple and increse the size of snake
        if (this.body[0].x == this.apple.x && this.body[0].y == this.apple.y) {
            this.createApple();
            this.snakeGrow();
        }

        // handling out of boundry conditions
        if (this.body[0].x < 0) {
            this.body[0].x = this.width - this.sizeOfBox;
        }

        if (this.body[0].x > this.width) {
            this.body[0].x = 0;
        }

        if (this.body[0].y < 0) {
            this.body[0].y = this.height - this.sizeOfBox;
        }

        if (this.body[0].y > this.height) {
            this.body[0].y = 0;
        }

        // handling eating tail
        let tail = this.body.slice(1);
        if (tail.filter(s => s.x == this.body[0].x && s.y == this.body[0].y).length > 0) {
            let ln = this.body.length;
            alert("You lost! \n Your score is " + ln);
            this.scene.scene.restart();
        }

    }

    setHead() {
        if (this.visiblebody[1].x > this.visiblebody[0].x) {
            this.visiblebody[0].setTexture("headLeft");
        } else if (this.visiblebody[1].x < this.visiblebody[0].x) {
            this.visiblebody[0].setTexture("headRight");
        } else if (this.visiblebody[1].y > this.visiblebody[0].y) {
            this.visiblebody[0].setTexture("headUp");
        } else if (this.visiblebody[1].y < this.visiblebody[0].y) {
            this.visiblebody[0].setTexture("headDown");
        }
    }

    getFittnesFromSnake() {
        return Math.random();
    }
}