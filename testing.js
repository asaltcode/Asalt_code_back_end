let model ={
    "title": "Introduction",
    "id": "85irzz8do",
    "type": "label",
    "time": 0,
    "items": [
        {
            "title": "1.1  What is web development, why do you need to learn it_",
            "id": "62f35294e4b0ee2b7310b143",
            "type": "video",
            "videoType": "upload",
            "time": 0,
            "duration": 3.1083333
        },
        {
            "title": "1.2 Who can learn this course?",
            "id": "62f29bf40cf2a331e5ca9ed0",
            "type": "video",
            "videoType": "upload",
            "time": 0,
            "duration": 2.3277833
        },
        {
            "title": "1.3 Requirements for starting this course",
            "id": "62f29bf40cf20962caf45403",
            "type": "video",
            "videoType": "upload",
            "time": 0,
            "duration": 2.3177834
        },
        {
            "title": "1.4 Overview of what we are going to learn",
            "id": "62f29bee0cf2a331e5ca9ecf",
            "type": "video",
            "videoType": "upload",
            "time": 0,
            "duration": 2.6516666
        },
        {
            "title": "1.5 Basic code setup to start learning",
            "id": "62f29bfe0cf2a331e5ca9ed1",
            "type": "video",
            "videoType": "upload",
            "time": 0,
            "duration": 5.338333
        }
    ]
}

const readline = require('readline');

const inp = readline.createInterface({
  input: process.stdin
});

const userInput = [];

inp.on("line", (data) => {
  userInput.push(data);
});

inp.on("close", () => {
  const binaryTree = userInput[0];
  const cities = userInput[1].split(' ');
  
  const minDistance = calculateMinDistance(binaryTree, cities[0], cities[1]);
  console.log(minDistance);
});

function calculateMinDistance(binaryTree, city1, city2) {
  const parentMap = {};
  
  // Build parent map
  let parent = '';
  for (let i = 0; i < binaryTree.length; i++) {
    const node = binaryTree[i];
    if (node === ' ') continue;
    if (node === city1 || node === city2) {
      parentMap[node] = parent;
    }
    parent = node;
  }
  
  // Find common ancestor
  let ancestor = city1;
  while (ancestor !== '') {
    if (isDescendant(city2, ancestor, parentMap)) {
      break;
    }
    ancestor = parentMap[ancestor];
  }
  
  // Calculate distance
  const distance1 = getDistance(city1, ancestor, parentMap);
  const distance2 = getDistance(city2, ancestor, parentMap);
  
  return distance1 + distance2;
}

function isDescendant(city, ancestor, parentMap) {
  while (city !== '') {
    if (city === ancestor) return true;
    city = parentMap[city];
  }
  return false;
}

function getDistance(city, ancestor, parentMap) {
  let distance = 0;
  while (city !== ancestor) {
    city = parentMap[city];
    distance++;
  }
  return distance;
}