import { InternalNode, MotorNode, SensorNode } from "./js-gen-lib/Gene.js";

export class getAppleDistance extends SensorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
    }

    /**
     * 
     * @param {object} inputParam {x: int, y: int}
     * @param {*} thisPos {x: int, y: int}
     * @returns {number} relative distance of the apple
     */
    setInputVal(inputParam = {x: 0, y: 0}, thisPos = {x: 0, y: 0}) {
        this.inputVal = Math.sqrt(
            Math.pow(inputParam.x-thisPos.x, 2)+Math.pow(inputParam.y-thisPos.y, 2)
        );
        return this.inputVal;
    }
} 

export class getAppleVerticalDirection extends SensorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
    }

    /**
     * 
     * @param {object} inputParam {x: int, y: int}
     * @param {object} thisPos {x: int, y: int}
     * @returns {int} 1 for upwoords -1 for downwards
     */
    setInputVal(inputParam = {x: 0, y: 0}, thisPos = {x: 0, y: 0}) {
        if (inputParam.y > thisPos.y) {
            this.inputVal = 1;
        } else {
            this.inputVal = -1;
        }
        return this.inputVal;
    }
}

export class getAppleHorizontalDirection extends SensorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
    }

    /**
     * 
     * @param {object} inputParam {x: int, y: int}
     * @param {object} thisPos {x: int, y: int}
     * @returns {int} 1 for right -1 for left
     */
     setInputVal(inputParam = {x: 0, y: 0}, thisPos = {x: 0, y: 0}) {
        if (inputParam.x > thisPos.x) {
            this.inputVal = 1;
        } else {
            this.inputVal = -1;
        }
        return this.inputVal;
    }
}

export class snakeInternalOne extends InternalNode {
    constructor(thisSourceId) {
        super(thisSourceId);
    }

    giveOut() {
        this.outputVal = this.inputVal;
        return this.outputVal;
    }
}

export class snakeInternalTwo extends InternalNode {
    constructor(thisSourceId) {
        super(thisSourceId);
    }

    giveOut() {
        this.outputVal = Math.tanh(this.inputVal);
        return this.outputVal;
    }
}

export class turnRight extends MotorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.label = "direction";
    }

    giveAction() {
        this.outputVal = Math.tanh(this.inputVal);
        if (this.outputVal !== undefined) {
            var myobj = {value: this.outputVal, order: "right"};
            return myobj;
        } else {
            return 0;
        }
    }
}

export class turnLeft extends MotorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.label = "direction";
    }

    giveAction() {
        this.outputVal = Math.tanh(this.inputVal);
        if (this.outputVal !== undefined) {
            var myobj = {value: this.outputVal, order: "left"};
            return myobj;
        } else {
            return 0;
        }
    }
}

export class turnDown extends MotorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.label = "direction";
    }

    giveAction() {
        this.outputVal = Math.tanh(this.inputVal);
        if (this.outputVal !== undefined) {
            var myobj = {value: this.outputVal, order: "down"};
            return myobj;
        } else {
            return 0;
        }
    }
}

export class turnUp extends MotorNode {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.label = "direction";
    }

    giveAction() {
        this.outputVal = Math.tanh(this.inputVal);
        if (this.outputVal !== undefined) {
            var myobj = {value: this.outputVal, order: "up"};
            return myobj;
        } else {
            return 0;
        }
    }
}