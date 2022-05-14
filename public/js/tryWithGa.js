import { Genesis, NodeBucket, NeuralNetwork } from "./js-gen-lib/Gene.js";
import { getAppleDistance, getAppleHorizontalDirection, getAppleVerticalDirection, snakeInternalOne, snakeInternalTwo, turnDown, turnLeft, turnRight, turnUp } from "./myNodes.js";
import Snake from "./Snake.js";

var nodeList = new NodeBucket();
nodeList.motorPush(turnDown);
nodeList.motorPush(turnUp);
nodeList.motorPush(turnRight);
nodeList.motorPush(turnLeft);

nodeList.internalPush(snakeInternalOne);
nodeList.internalPush(snakeInternalTwo);

nodeList.sensorPush(getAppleVerticalDirection);
nodeList.sensorPush(getAppleDistance);
nodeList.sensorPush(getAppleHorizontalDirection);

var newGenesis = new Genesis(nodeList);
newGenesis.populate(100, 10);

// For loop to go until generation 100
var mysnake = new Snake();
for (let index = 0; index < 100; index++) {
    var tempPop = []
    newGenesis.readyPopulation();
    newGenesis.getPopulation().forEach(element => {
        element.setFitness(mysnake.getFittnesFromSnake());
        tempPop.push(element);
    })
    newGenesis.setPopulation(tempPop);
    newGenesis.mutate(0.01, 0.1);
    newGenesis.newGeneration(0.1);
}

console.log(newGenesis.generationNum);
newGenesis.readyPopulation();
newGenesis.printPopulation();
