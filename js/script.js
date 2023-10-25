document.addEventListener("DOMContentLoaded", function () {

let unknownWordBtn = document.getElementById("unknownWordBtn");
unknownWordBtn.addEventListener("click", unknownWord);

let knownWordBtn = document.getElementById("knownWordBtn");
knownWordBtn.addEventListener("click", knownWord);

let vocabWordInitial = document.getElementById("vocabWordInitial");
let vocabWord = document.getElementById("vocabWord");
vocabWord.style.display = "none";


let doneStudyingBtn = document.getElementById("doneStudyingBtn");
doneStudyingBtn.style.display = "none";
doneStudyingBtn.addEventListener("click", doneStudying);

let wordsKnownStats = document.getElementById("words-known-stats");
let wordsMasteredStats = document.getElementById("words-mastered-stats");
let wordsRemainingStats = document.getElementById("words-remaining-stats");

let forgotWordText = document.getElementById("forgotWordText");
forgotWordText.style.display = "none";

let doYouKnowText = document.getElementById("doYouKnowText");

let sampleContainer = document.getElementById("sample-container");
sampleContainer.style.display = "none";

let englishTranslation = document.getElementById("englishTranslation");
englishTranslation.style.display = "none";

let chineseSampleSentence = document.getElementById("chineseSampleSentence");
let chineseSampleSentenceTranslation = document.getElementById("chineseSampleSentenceTranslation");

let randomWord, randomChineseWord, chineseWordTranslation, chineseSentence, englishSentence;

// List of words that are due for review according to their "nextReviewDate" property
let dueForReview = [];

let nextWordsList = [];

// Vocabulary Lists
let selectedVocabularyList = hsk1;

// 
let hsk1Btn = document.getElementById("hsk1");
hsk1Btn.addEventListener("click", function(){
    changeColor(hsk1Btn);
    selectedVocabularyList = hsk1;
    nextWordsList = [];
    initialWordList();
    console.log("hsk1 vocab list selected");
});

let hsk2Btn = document.getElementById("hsk2");
hsk2Btn.addEventListener("click", function(){
    changeColor(hsk2Btn);
    selectedVocabularyList = hsk2;
    nextWordsList = [];
    initialWordList();
    console.log("hsk2 vocab list selected");
});

// Millisecond conversions and variables for Spaced Repetition Schedule
const halfDayInMilliseconds = 0.5 * 24 * 60 * 60 * 1000;
const oneDayInMilliseconds = 1 * 24 * 60 * 60 * 1000;
const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
const twentyOneDaysInMilliseconds = 21 * 24 * 60 * 60 * 1000;
const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
const fortyFiveDaysInMilliseconds = 45 * 24 * 60 * 60 * 1000;
const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

// Button triggers for review mode studying and new word studying
let isReviewMode = false;

let newWordsBtn = document.getElementById("newWords");
newWordsBtn.addEventListener("click", function() {
    isReviewMode = false;
    changeColor(newWordsBtn);
});

let reviewWordsBtn = document.getElementById("reviewWords");
reviewWordsBtn.addEventListener("click", function() {
    isReviewMode = true;
    changeColor(reviewWordsBtn);
});



function changeColor(button) {
    // Remove the highlighting class from all buttons
    const buttons = document.querySelectorAll('.mode-button');
    buttons.forEach((btn) => {
      btn.classList.remove('mode-button-clicked');
    });
  
    // Add the highlighting class to the clicked button
    button.classList.add('mode-button-clicked');
}


function pushNewWordToInitialWordList(vocabularyList){
    // Get a random index within the range of the hsk1 vocabulary list
    let randomIndex = Math.floor(Math.random() * vocabularyList.length);

    // Access the word at the random index
    randomWord = vocabularyList[randomIndex];

    while (randomWord.rightInARow >= 1){
        randomIndex = Math.floor(Math.random() * vocabularyList.length);
        randomWord = vocabularyList[randomIndex];
    };

    // if (nextWordsList.includes(randomWord)){
    //     randomIndex = Math.floor(Math.random() * vocabularyList.length);
    //     randomWord = vocabularyList[randomIndex];
    // }

    nextWordsList.push(randomWord);
}


function initialWordList(){
    for (let i = 0; i < 10; i++){
        pushNewWordToInitialWordList(selectedVocabularyList);
    }
    console.log("initialWordList: ", nextWordsList);
}


// Updates dueForReview list
function updateDueForReviewList(vocabularyList) {
    const now = Date.now();
    dueForReview.push(...vocabularyList.filter(word => word.nextReviewDate <= (now - halfDayInMilliseconds)));
    console.log("due for review list: ", dueForReview);
}


// Updates the stats section
function countStats(vocabularyList){
    wordsKnown = 0;
    wordsMastered = 0;
    wordsRemaining = 0;
    for (let i = 0; i < vocabularyList.length; i++){
        if (vocabularyList[i].rightInARow === 7) {
            wordsMastered += 1;
        } else if (vocabularyList[i].rightInARow >= 1 && vocabularyList[i].rightInARow != 7){
            wordsKnown += 1;
        } else if (vocabularyList[i].rightInARow === 0){
            ++wordsRemaining;
        }
    }
    wordsKnownStats.innerHTML = wordsKnown;
    wordsMasteredStats.innerHTML = wordsMastered;
    wordsRemainingStats.innerHTML = wordsRemaining;
}


// Gets the next vocab word
function getNextWord(){
    englishTranslation.style.display = "none";
    sampleContainer.style.display = "none";

    // Get a new random word and push to the initial word list to replenish
    // pushNewWordToInitialWordList();

    if (isReviewMode && dueForReview.length >= 1){
        randomWord = dueForReview.shift();
        randomChineseWord = randomWord.chinese;
        chineseWordTranslation = randomWord.english;
        chineseSentence = randomWord.sampleChinese;
        englishSentence = randomWord.sampleEnglish;
    } else {
        randomWord = nextWordsList.shift();
        randomChineseWord = randomWord.chinese;
        chineseWordTranslation = randomWord.english;
        chineseSentence = randomWord.sampleChinese;
        englishSentence = randomWord.sampleEnglish;
    }

    // Display the random word
    const vocabWord = document.getElementById("vocabWord");
    vocabWord.innerText = randomChineseWord;
    vocabWordInitial.innerText = randomChineseWord;
    vocabWordInitial.style.display = "block";
    vocabWord.style.display = "none";
}


// Triggered if user clicks "I don't know" for a word
function unknownWord(){
    sampleContainer.style.display = "inline-block";
    vocabWordInitial.style.display = "none";
    vocabWord.style.display = "block";
    englishTranslation.style.display = "block";
    doneStudyingBtn.style.display = "block";
    unknownWordBtn.style.display = "none";
    knownWordBtn.style.display = "none";
    forgotWordText.style.display = "block";
    doYouKnowText.style.display = "none";

    englishTranslation.innerHTML = chineseWordTranslation;
    chineseSampleSentence.innerHTML = chineseSentence;
    chineseSampleSentenceTranslation.innerHTML = englishSentence;

    // resets the user's streak of how many times they've gotten the word correct
    randomWord.rightInARow = 0;
    // puts the unknown word in queue to be reviewed again (in index position 3)
    nextWordsList.splice(3,0,randomWord);

    console.log("randomWord: ", randomWord);
    console.log("initialWordList: ", nextWordsList);
    console.log(randomWord.chinese, randomWord.rightInARow);
}


// Triggered if user clicks "I think I know" for a word
function knownWord(){
    randomWord.rightInARow += 1;

    if (randomWord.rightInARow === 1) {
        randomWord.nextReviewDate = Date.now() + oneDayInMilliseconds;
    } else if (randomWord.rightInARow === 2) {
        randomWord.nextReviewDate = Date.now() + threeDaysInMilliseconds;
    } else if (randomWord.rightInARow === 3) {
        randomWord.nextReviewDate = Date.now() + sevenDaysInMilliseconds;
    } else if (randomWord.rightInARow === 4) {
        randomWord.nextReviewDate = Date.now() + twentyOneDaysInMilliseconds;
    } else if (randomWord.rightInARow === 5) {
        randomWord.nextReviewDate = Date.now() + thirtyDaysInMilliseconds;
    } else if (randomWord.rightInARow === 6) {
        randomWord.nextReviewDate = Date.now() + fortyFiveDaysInMilliseconds;
    } else if (randomWord.rightInARow === 7) {
        randomWord.nextReviewDate = Date.now() + sixtyDaysInMilliseconds;
    }

    
    console.log(randomWord.chinese, randomWord.rightInARow);
    console.log(randomWord.nextReviewDate);

    countStats(selectedVocabularyList);
    pushNewWordToInitialWordList(selectedVocabularyList);
    getNextWord();
}


// Triggers next word after user is done studying the previous word
function doneStudying(){
    doneStudyingBtn.style.display = "none";
    unknownWordBtn.style.display = "inline-block";
    knownWordBtn.style.display = "inline-block";
    forgotWordText.style.display = "none";
    doYouKnowText.style.display = "block";

    englishTranslation.innerHTML = "";
    chineseSampleSentence.innerHTML = "";
    chineseSampleSentenceTranslation.innerHTML = "";

    getNextWord();
}



// Upon initial page load
initialWordList();
countStats(selectedVocabularyList);
updateDueForReviewList(selectedVocabularyList);
if (dueForReview.length >= 1){
    isReviewMode = true;
    changeColor(reviewWordsBtn);
}
getNextWord();


});