import Snake from "./Snake.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.Snake = new Snake(this);
    }

    update(time) {
        this.Snake.update(time);
    }

    preload() {
        this.load.image("headUp", "images/head-up.jpg");
        this.load.image("headDown", "images/head-down.jpg");
        this.load.image("headLeft", "images/head-left.jpg");
        this.load.image("headRight", "images/head-right.jpg");

        this.load.image("body", "images/body.jpg");
    }

}