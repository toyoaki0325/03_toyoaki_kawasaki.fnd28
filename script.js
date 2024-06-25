'use strict'


document.getElementById("startButton").addEventListener("click", startGame);

let currentLevel = 0; 
const levels = [
    { kanjiObj: { 1: "質", 2: "貝" }, size: 5, probability: 0.15, time: 10, nextLabel: "次へ進む", difficulty: "【難易度やさしい】", instruction: "質でない漢字を全てみつけろ！！" },
    { kanjiObj: { 1: "実", 2: "實" }, size: 8, probability: 0.05, time: 10, nextLabel: "難しいへ進む", difficulty: "【難易度ふつう】", instruction: "実でない漢字を全てみつけろ！！" },
    { kanjiObj: { 1: "剛", 2: "岡" }, size: 10, probability: 0.05, time: 10, nextLabel: "ナイトメア", difficulty: "【難易度むずかしい】", instruction: "剛でない漢字をみつけろ！！" },
    { kanjiObj: { 1: "健", 2: "建" }, size: 20, probability: 0.05, time: 15, nextLabel: "成績を見る", difficulty: "【悪夢レベル】", instruction: "健以外の漢字を全て見つけれたら、天才！！" }
];

let totalBuilds = 0;
let clickedBuilds = 0;
const results = [];

function startGame() {
    document.getElementById("introText").style.display = "none";
    document.getElementById("startButton").style.display = "none";
		startLevel(currentLevel);
}

function startLevel(levelIndex) {
    const level = levels[levelIndex];
    document.getElementById("gameContainer").style.display = "block";
    document.getElementById("nextButtonContainer").style.display = "none";
    document.getElementById("countdown").textContent = level.time;
    document.getElementById("gameInstruction").innerHTML = `<div>${level.difficulty}</div><div>${level.instruction}</div>`;
    totalBuilds = 0;
    clickedBuilds = 0;
    displayKanjiGrid(level);
    startCountdown(level.time, levelIndex);
}

function startCountdown(time, levelIndex) {
	let countdown = time;
	const countdownElement = document.getElementById("countdown");
	const resultContainer = document.getElementById("result");
	resultContainer.classList.add("hidden"); 

	const interval = setInterval(function() {
			countdown--;
			countdownElement.textContent = countdown;
			if (countdown === 0) {
					clearInterval(interval);
					endLevel(levelIndex);
					resultContainer.classList.remove("hidden"); 
			}
	}, 1000);
}


function displayKanjiGrid(level) {
	const gridContainer = document.getElementById("kanjiGrid");
	gridContainer.style.gridTemplateColumns = `repeat(${level.size}, 20px)`;
	gridContainer.style.gridTemplateRows = `repeat(${level.size}, 20px)`;
	gridContainer.innerHTML = ""; // 以前のグリッドをクリア

	for (let i = 0; i < level.size * level.size; i++) {
			const kanjiElement = document.createElement("div");
			kanjiElement.classList.add("kanji");

			if (Math.random() < level.probability) {
					kanjiElement.textContent = level.kanjiObj[2];
					totalBuilds++;
			} else {
					kanjiElement.textContent = level.kanjiObj[1];
			}

			kanjiElement.addEventListener("click", function() {
					if (kanjiElement.textContent === level.kanjiObj[2] && !kanjiElement.classList.contains("clicked")) {
							kanjiElement.classList.add("clicked");
							clickedBuilds++;
					}
			});

			gridContainer.appendChild(kanjiElement);
	}
}


function endLevel(levelIndex) {
	document.getElementById("gameContainer").style.display = "none";
	const resultContainer = document.getElementById("result");
	resultContainer.style.display = "block";
	const accuracy = ((clickedBuilds / totalBuilds) * 100).toFixed(2);
	resultContainer.innerHTML = `総数: ${totalBuilds}, 回答数: ${clickedBuilds}, 回答率: ${accuracy}%`;
	results[levelIndex] = accuracy;

	if (levelIndex < levels.length - 1) {
			const nextButton = document.getElementById("nextButton");
			nextButton.textContent = levels[levelIndex].nextLabel;
			document.getElementById("nextButtonContainer").style.display = "block";
			nextButton.onclick = function() {
					currentLevel++;
					startLevel(currentLevel);
			};
	} else {
			displayFinalResults();
	}
}


function displayFinalResults() {
	const resultContainer = document.getElementById("result");
	resultContainer.innerHTML += "<br>すべての成績:<br>";
	let all100 = true;
	let nightmare100 = true;

	levels.forEach(function(level, index) {
			resultContainer.innerHTML += `レベル ${index + 1} (${level.kanjiObj[1]}-${level.kanjiObj[2]}): ${results[index]}%<br>`;
			if (results[index] < 100) {
					all100 = false;
					if (index < 3) {
							nightmare100 = false;
					}
			}
	});

	const finalMs = document.createElement("div");
	if (all100) {
			finalMs.textContent = "神の目を持つ貴殿には、品質不良を見抜く素質が大いにある。おめでとう！！";
			finalMs.style.color = "blue";
			finalMs.style.fontSize = "30px";
	} else if (nightmare100) {
			finalMs.textContent = "あとは悪夢のみ！！DIGを受ければ解けるかもしれないぞ？";
			finalMs.style.color = "purple";
			finalMs.style.fontSize = "30px";
	} else {
			finalMs.textContent = "もっとがんばろう！！";
			finalMs.style.color = "red";
			finalMs.style.fontSize = "24px";
	}
	resultContainer.appendChild(finalMs);
}
