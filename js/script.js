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

// Millisecond conversions and variables for Spaced Repetition Schedule
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
});

let reviewWordsBtn = document.getElementById("reviewWords");
reviewWordsBtn.addEventListener("click", function() {
    isReviewMode = true;
});

// List of words that are due for review according to their "nextReviewDate" property
let dueForReview = [];

// Updates dueForReview list
function updateDueForReviewList() {
    const now = Date.now();
    dueForReview.push(...hsk1.filter(word => word.nextReviewDate <= now));
    console.log("due for review list: ", dueForReview);
}

// Updates the stats section
function countStats(){
    wordsKnown = 0;
    wordsMastered = 0;
    wordsRemaining = 0;
    for (let i = 0; i < hsk1.length; i++){
        if (hsk1[i].rightInARow === 7) {
            wordsMastered += 1;
        } else if (hsk1[i].rightInARow >= 1 && hsk1[i].rightInARow != 7){
            wordsKnown += 1;
        } else if (hsk1[i].rightInARow === 0){
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

    if (isReviewMode && dueForReview.length >= 1){
        randomWord = dueForReview.shift();
        randomChineseWord = randomWord.chinese;
        chineseWordTranslation = randomWord.english;
        chineseSentence = randomWord.sampleChinese;
        englishSentence = randomWord.sampleEnglish;
    } else {
        // Get a random index within the range of the hsk1 vocabulary list
        let randomIndex = Math.floor(Math.random() * hsk1.length);

        // Access the word at the random index
        randomWord = hsk1[randomIndex];

        while (randomWord.rightInARow >= 1){
            randomIndex = Math.floor(Math.random() * hsk1.length);
            randomWord = hsk1[randomIndex];
        }

        randomChineseWord = hsk1[randomIndex].chinese;
        chineseWordTranslation = hsk1[randomIndex].english;
        chineseSentence = hsk1[randomIndex].sampleChinese;
        englishSentence = hsk1[randomIndex].sampleEnglish;
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

    randomWord.rightInARow = 0;
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

    countStats();
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
countStats();
updateDueForReviewList();
getNextWord();


});