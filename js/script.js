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

let dueForReviewNumber = document.getElementById("dueForReviewNumber");
let wordsKnownStats = document.getElementById("words-known-stats");
let wordsMasteredStats = document.getElementById("words-mastered-stats");
let wordsRemainingStats = document.getElementById("words-remaining-stats");

let forgotWordText = document.getElementById("forgotWordText");
forgotWordText.style.display = "none";

let doYouKnowText = document.getElementById("doYouKnowText");

let sampleContainer = document.getElementById("sample-container");
sampleContainer.style.display = "none";

let pinyin = document.getElementById("pinyin");
pinyin.style.display = "none";

let englishTranslation = document.getElementById("englishTranslation");
englishTranslation.style.display = "none";

let chineseSampleSentence = document.getElementById("chineseSampleSentence");
let chineseSampleSentenceTranslation = document.getElementById("chineseSampleSentenceTranslation");

let randomWord = null;
let randomChineseWord, chineseWordTranslation, chineseSentence, englishSentence;


// List of words that are due for review according to their "nextReviewDate" property
let dueForReview = [];

let nextWordsList = [];

// Button triggers for review mode studying and new word studying
let isReviewMode = false;

// Vocabulary Lists
let selectedVocabularyList = hsk1;

let currentVocabularyList = selectedVocabularyList;



// Set keys for HSK1 and HSK2 vocabulary lists in local storage
const hsk1LocalStorageKey = "hsk1VocabList";
const hsk2LocalStorageKey = "hsk2VocabList";

// Check if HSK1 vocabulary list exists in local storage, if not, initialize it
let hsk1VocabularyList = JSON.parse(localStorage.getItem(hsk1LocalStorageKey));
if (!hsk1VocabularyList) {
    hsk1VocabularyList = hsk1; // Default to hsk1 if not found
}

// Check if HSK2 vocabulary list exists in local storage, if not, initialize it
let hsk2VocabularyList = JSON.parse(localStorage.getItem(hsk2LocalStorageKey));
if (!hsk2VocabularyList) {
    hsk2VocabularyList = hsk2; // Default to hsk2 if not found
}

// If hsk1 button is pressed, change selectedVocabularyList variable, clear nextWordsList and replenish list, refresh stats for new vocab list
let hsk1Btn = document.getElementById("hsk1");
hsk1Btn.addEventListener("click", function(){
    changeHskColor(hsk1Btn);
    selectedVocabularyList = hsk1VocabularyList;
    nextWordsList = [];
    initialWordList();
    // Clear the "dueForReview" list when switching to HSK1
    dueForReview = [];
    updateDueForReviewList(selectedVocabularyList);

    countStats(selectedVocabularyList);
    // localStorage.setItem(hsk1LocalStorageKey, JSON.stringify(hsk1VocabularyList)); // Save the selected list
    console.log("hsk1 vocab list selected");
});

let hsk2Btn = document.getElementById("hsk2");
hsk2Btn.addEventListener("click", function(){
    changeHskColor(hsk2Btn);
    selectedVocabularyList = hsk2VocabularyList;
    nextWordsList = [];
    initialWordList();
    isReviewMode = false;
    // Clear the "dueForReview" list when switching to HSK1
    dueForReview = [];
    updateDueForReviewList(selectedVocabularyList);


    changeColor(newWordsBtn);
    countStats(selectedVocabularyList);
    console.log("due for review list: ", dueForReview);

    // localStorage.setItem(hsk2LocalStorageKey, JSON.stringify(hsk2VocabularyList)); // Save the selected list
    console.log("hsk2 vocab list selected");
});

// Millisecond conversions and variables for testing purposes
const halfMinInMilliseconds = 30000;
const oneMinInMilliseconds = 60000;
const twoMinInMilliseconds = 120000;


// Millisecond conversions and variables for Spaced Repetition Schedule
const halfDayInMilliseconds = 0.5 * 24 * 60 * 60 * 1000;
const oneDayInMilliseconds = 1 * 24 * 60 * 60 * 1000;
const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
const twentyOneDaysInMilliseconds = 21 * 24 * 60 * 60 * 1000;
const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
const fortyFiveDaysInMilliseconds = 45 * 24 * 60 * 60 * 1000;
const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;


let newWordsBtn = document.getElementById("newWords");
newWordsBtn.addEventListener("click", function() {
    changeColor(newWordsBtn);
    isReviewMode = false;
});

let reviewWordsBtn = document.getElementById("reviewWords");
reviewWordsBtn.addEventListener("click", function() {
    changeColor(reviewWordsBtn);
    isReviewMode = true;
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

function changeHskColor(button) {
    // Remove the highlighting class from all buttons
    const buttons = document.querySelectorAll('.mode-button-hsk');
    buttons.forEach((btn) => {
      btn.classList.remove('mode-button-hsk-clicked');
    });
  
    // Add the highlighting class to the clicked button
    button.classList.add('mode-button-hsk-clicked');
}


function pushNewWordToInitialWordList(vocabularyList){
    if (randomWord === null) {
        randomWord = {}; // Initialize randomWord as an empty object
    }
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
    dueForReview.push(
        ...vocabularyList.filter(word => 
            word.rightInARow > 0 && word.nextReviewDate <= now
        )
    );

    if (dueForReview.length === 0) {
        reviewWordsBtn.disabled = true;
    } else {
        reviewWordsBtn.disabled = false;
    }
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
    dueForReview = [];
    updateDueForReviewList(selectedVocabularyList);
 
    dueForReviewStat = dueForReview.length;

    wordsKnownStats.innerHTML = wordsKnown;
    wordsMasteredStats.innerHTML = wordsMastered;
    wordsRemainingStats.innerHTML = wordsRemaining;
    dueForReviewNumber.innerHTML = dueForReviewStat
}


// Gets the next vocab word
function getNextWord(){
    pinyin.style.display = "none";
    englishTranslation.style.display = "none";
    sampleContainer.style.display = "none";

    // Get a new random word and push to the initial word list to replenish
    // pushNewWordToInitialWordList();

    if (isReviewMode && dueForReview.length >= 1){
        randomWord = dueForReview.shift();
        randomChineseWord = randomWord.chinese;
        pinyinWord = randomWord.pinyin;
        chineseWordTranslation = randomWord.english;
        chineseSentence = randomWord.sampleChinese;
        englishSentence = randomWord.sampleEnglish;
    } else {
        randomWord = nextWordsList.shift();
        randomChineseWord = randomWord.chinese;
        pinyinWord = randomWord.pinyin;
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
    pinyin.style.display = "block";
    englishTranslation.style.display = "block";
    doneStudyingBtn.style.display = "block";
    unknownWordBtn.style.display = "none";
    knownWordBtn.style.display = "none";
    forgotWordText.style.display = "block";
    doYouKnowText.style.display = "none";

    pinyin.innerHTML = pinyinWord;
    englishTranslation.innerHTML = chineseWordTranslation;
    chineseSampleSentence.innerHTML = chineseSentence;
    chineseSampleSentenceTranslation.innerHTML = englishSentence;

    // resets the user's streak of how many times they've gotten the word correct
    randomWord.rightInARow = 0;
    // puts the unknown word in queue to be reviewed again (in index position 3)
    nextWordsList.splice(3,0,randomWord);


    // Save the selected HSK1 vocabulary list in local storage
    localStorage.setItem(hsk1LocalStorageKey, JSON.stringify(hsk1VocabularyList));

    // Save the selected HSK2 vocabulary list in local storage
    localStorage.setItem(hsk2LocalStorageKey, JSON.stringify(hsk2VocabularyList));

    console.log("randomWord: ", randomWord);
    console.log("initialWordList: ", nextWordsList);
    console.log(randomWord.chinese, randomWord.rightInARow);
}


// Triggered if user clicks "I think I know" for a word
function knownWord(){
    randomWord.rightInARow += 1;

    if (randomWord.rightInARow === 1) {
        randomWord.nextReviewDate = Date.now() + oneMinInMilliseconds;
    } else if (randomWord.rightInARow === 2) {
        randomWord.nextReviewDate = Date.now() + oneDayInMilliseconds;
    } else if (randomWord.rightInARow === 3) {
        randomWord.nextReviewDate = Date.now() + threeDaysInMilliseconds;
    } else if (randomWord.rightInARow === 4) {
        randomWord.nextReviewDate = Date.now() + sevenDaysInMilliseconds;
    } else if (randomWord.rightInARow === 5) {
        randomWord.nextReviewDate = Date.now() + twentyOneDaysInMilliseconds;
    } else if (randomWord.rightInARow === 6) {
        randomWord.nextReviewDate = Date.now() + thirtyDaysInMilliseconds;
    } else if (randomWord.rightInARow === 7) {
        randomWord.nextReviewDate = Date.now() + fortyFiveDaysInMilliseconds;
    } else if (randomWord.rightInARow === 8) {
        randomWord.nextReviewDate = Date.now() + sixtyDaysInMilliseconds;
    }

    if (dueForReview.length === 0){
        isReviewMode = false;
        changeColor(newWordsBtn);
    }

    // Save the selected HSK1 vocabulary list in local storage
    localStorage.setItem(hsk1LocalStorageKey, JSON.stringify(hsk1VocabularyList));

    // Save the selected HSK2 vocabulary list in local storage
    localStorage.setItem(hsk2LocalStorageKey, JSON.stringify(hsk2VocabularyList));
    
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
selectedVocabularyList = hsk1VocabularyList;
initialWordList();
countStats(selectedVocabularyList);
// updateDueForReviewList(selectedVocabularyList);
getNextWord();


});