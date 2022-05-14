import { binaryToDecimal, bitFlip, createRandomBytes, getRandomFromList, getRandomInt } from "./js-gen-util.js";

export class Neuron {
    constructor() {
        //console.log("works")
        this.identity = createRandomBytes(32)
        this.setElems();
    }

    setElems() {
        // source ID: to chose the connection to send
        this.sourceID = this.identity.slice(0, 9);

        // source type: 1-sensor 0-internal/or motor
        this.sourceType = this.identity.slice(0, 1);
        
        // send ID: to chose to connection to send
        this.sendID = this.identity.slice(9, 17);
        
        // send parameter: 1-internal 0-motor
        this.sendParam = this.identity.slice(9, 10)

        // wieght for results
        this.weight = this.identity.slice(16)
    }

    giveOutPut() {
        console.log("output");
    }

    getSourceType() {
        return this.sourceType;
    }

    mutate() {
        var myRandom = getRandomInt(0, 31);
        this.identity = bitFlip(this.identity, myRandom);
        this.setElems();
    }
}

export class Node {
    constructor(thisSourceId) {
        this.thisID = thisSourceId;
        this.inputVal = undefined;
        this.outputVal = undefined;
        this.typeName = undefined;
        this.isInputSet = false;
    }

    // to be overrided by the user
    setInputVal(inputParam = 0) {
        this.inputVal = inputParam;
        return this.inputVal;
    }
}

export class MotorNode extends Node {
    constructor(thisSourceId, thislabel="") {
        super(thisSourceId);
        this.label = thislabel;
        this.typeName = "motor"
    }

    giveAction() {
        this.outputVal = Math.tanh(this.inputVal);
        if (this.outputVal !== undefined) {
            return this.outputVal;
        } else {
            return 0;
        }
    }
}

export class InternalNode extends Node {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.typeName = "internal"
    }

    giveOut() {
        this.outputVal = this.inputVal;
        return this.outputVal;
    }
}

export class SensorNode extends Node {
    constructor(thisSourceId) {
        super(thisSourceId);
        this.typeName = "sensor"
        this.inputVal = 1;
    }
}



export class NodeBucket {
    constructor(internalArr = [], sensorArr = [], motorArr = []) {
        this.internalList = [];
        internalArr.forEach(element => {
            this.internalList.push(element);
        });

        this.sensorList = [];
        sensorArr.forEach(element => {
            this.sensorList.push(element);
        })

        this.motorList = [];
        motorArr.forEach(element => {
            this.motorList.push(element);
        })
    }

    // push neuron methods
    /**
     * it is same for all other "***Push" methods
     * @param {Node} newNode new node as Node 
     * @param {Node[]} newNode new node as Node List
     */
    internalPush(newNode) {
        if (typeof(newNode) == typeof(Node)) {
            this.internalList.push(newNode);
        } else {
            newNode.forEach(element => {
                this.internalList.push(element);
            })
        }
    }

    sensorPush(newNode) {
        if (typeof(newNode) == typeof(Node)) {
            this.sensorList.push(newNode);
        } else {
            newNode.forEach(element => {
                this.sensorList.push(element);
            })
        }
    }

    motorPush(newNode) {
        if (typeof(newNode) == typeof(Node)) {
            this.motorList.push(newNode);
        } else {
            newNode.forEach(element => {
                this.motorList.push(element);
            })
        }
    }

    /**
     * select relevant node
     * @param {7-bit} sensorId 
     * @returns {SensorNode}
     */
    selectSensor(sensorId) {
        var lenSensor = this.sensorList.length;
        var thisSensor = binaryToDecimal(sensorId);
        if (thisSensor < lenSensor) {
            return new this.sensorList[lenSensor%thisSensor](sensorId);
        } else {
            return new this.sensorList[thisSensor%lenSensor](sensorId);
        }
    }

    selectMotor(motorId) {
        var lenMotor = this.motorList.length;
        var thisMotor = binaryToDecimal(motorId);
        if (thisMotor < lenMotor) {
            return new this.motorList[lenMotor%thisMotor](motorId);
        } else {
            return new this.motorList[thisMotor%lenMotor](motorId);
        }
    }

    selectInternal(interalId) {
        var lenInternal = this.internalList.length;
        var thisInternal = binaryToDecimal(interalId);
        if (thisInternal < lenInternal && thisInternal != 0) {
            return new this.internalList[lenInternal%thisInternal](interalId);
        }
        else {
            return new this.internalList[thisInternal%lenInternal](interalId);
        }
    }
}

export class NeuralNetwork {
    constructor(numElem, bucket) {
        this.fintness = 0; // it is going to take a value between 0.00-1.00
        this.actionList = []
        this.bucket = bucket;
        this.neuralList = [];
        this.connections = [];
        while (this.neuralList.length < numElem) {
            var nextNeuron = new Neuron();
            this.neuralList.push(nextNeuron);
        }
    }

    pushNeuron(myNeuron) {
        this.neuralList.push(myNeuron);
    }

    // return bucket related to this network
    bucketUpdate(bucket) {
        this.bucket = bucket;
    }
    
    // return the this neural list
    getNeuralList() {
        return this.neuralList;
    }
    
    getResults() {

    }

    printNet() {
        this.neuralList.forEach(element => {
            console.log(element);
        })
    }

    printNode() {
        this.connections.forEach(element => {
            console.log(element);
        })
    }

    printAction() {
        this.actionList.forEach(element => {
            console.log(element);
        })
    }

    initFeedForward(refId, nextNeruon) {
        //console.log("init feed forward");
        var firstVal = undefined;
        for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].thisID == refId) {
                if (this.connections[i].isInputSet == false) {
                    this.connections[i].setInputVal();
                    firstVal = this.connections[i].inputVal;
                    this.connections[i].isInputSet = true;
                }
                break;
            }
        }
        this.feedForward(firstVal ,nextNeruon);
    }

    feedForward(prevVal, nextNeruon) {
        //console.log("feed forward");
        var coof = binaryToDecimal(nextNeruon.weight) / Math.pow(2,14);
        for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].thisID == nextNeruon.sendID && this.connections[i].typeName != "sensor") {
                this.connections[i].setInputVal(coof);
                if (this.connections[i].typeName == "motor") {
                    this.actionList.push(
                        {
                            thisId: this.connections[i].thisID,
                            thisAction: this.connections[i].giveAction()
                        }
                    );
                    //this.actionList[this.connections[i].thisID] = this.connections[i].giveAction();
                    return;
                } else {
                    for (var j = 0; j < this.neuralList.length; j++) {
                        if (this.neuralList[j].sourceID == nextNeruon.sendID) {
                            this.feedForward(
                                this.connections[i].giveOut(),
                                this.neuralList[j]
                            );
                        }
                    }
                }
            }
        }
    }

    processNodes() {
        this.makeConnections();
        this.neuralList.forEach(element => {
            if (element.sourceType == 1) {
                this.initFeedForward(element.sourceID, element);
            }
        });
    }

    makeConnections() {
        // connection list is a Node list
        this.connections = [];
        this.neuralList.forEach(element => {
            if (element.sourceType == 1) {
                // certainly sensor
                this.connections.push(
                    this.bucket.selectSensor(element.sourceID)
                );
            } else {
                // certainly internal
                this.connections.push(
                    this.bucket.selectInternal(element.sourceID)
                );
            } 
            if (element.sendParam == 1) {
                // certainly motor
                this.connections.push(
                    this.bucket.selectMotor(element.sendID)
                );
            } else {
                // certainly internal
                this.connections.push(
                    this.bucket.selectInternal(element.sendID)
                );
            } 
        })
    }

    mutate(prob) {
        if (getRandomInt(1, 1/prob) === 1) {
            this.neuralList[Math.floor(Math.random()*this.neuralList.length)].mutate();
        }
    }

    setFitness(num) {
        this.fintness = num;
    }
}

export class Genesis {
    /**
     * 
     * @param {NodeBucket} bucket // bucket
     */
    constructor(bucket) {
        this.bucket = bucket;
        this.population = []
        this.populationSize = 0;
        this.gens = 0;
        this.generationNum = 0;
    }

    populate(num, gens) {
        this.population = [];
        this.populationSize = num;
        this.gens = gens;
        this.generationNum = 0;
        while (num > 0) {
            this.population.push(new NeuralNetwork(this.gens, this.bucket));
            num--;
        }
    }

    printPopulation() {
        this.population.forEach(element => {
            console.log(element);
        });
    }

    getPopulation() {
        return this.population;
    }

    setPopulation(newPopulation) {
        this.population = newPopulation;
    }

    setBucket(newBucket) {
        this.bucket = newBucket;
    }

    mutate(probPersona = 0.001, probInnerPersona = 1) {
        this.population.forEach(element => {
            if (getRandomInt(1, 1/probPersona) === 1) {
                element.mutate(probInnerPersona);
            }
        });
    }

    chooseToBreed(bestPercantage) {
        this.population.sort((a, b) => parseFloat(b.fintness) - parseFloat(a.fintness));
        var toBreed = [];
        var len = bestPercantage * this.population.length;
        for (var i = 0; i <= len; i++) {
            toBreed.push(this.population[i]);
        }
        return toBreed;
    }

    breedFromTwo(myList) {
        var newFather = getRandomFromList(myList);
        var newMother = getRandomFromList(myList);
        var newChild = new NeuralNetwork(0, this.bucket);
        for (var i = 0; i < this.gens; i++) {
            if (i % 2 == 0) {
                newChild.pushNeuron(
                    getRandomFromList(newFather.neuralList)
                );
            } else {
                newChild.pushNeuron(
                    getRandomFromList(newMother.neuralList)
                );
            }
        }
        return newChild;
    }

    newGeneration(bestPercantage) {
        var toBreed = this.chooseToBreed(bestPercantage)
        var newGeneration = [];
        while (newGeneration.length < this.populationSize) {
            newGeneration.push(this.breedFromTwo(toBreed)); 
        }
        this.population = newGeneration;
        this.generationNum++;
    }

    readyPopulation() {
        this.population.forEach(element => {
            element.processNodes();
        });
    }
}