# HSK-Hero

HSK HERO is a web application designed for learning and reviewing Mandarin Chinese vocabulary based on HSK (proficiency) levels. This app utilizes a SRS (spaced repetition system) to track when studied words are due for review based on user performance. User progress is saved to local storage. 

# Project Structure
The project is primarily an HTML and JavaScript-based web application with some CSS for styling. The main files and folders include:

**index.html**: The main HTML file containing the structure of the application.

**js/**: This folder contains JavaScript files responsible for the application's functionality:

**hsk1.js and hsk2.js**: These files store the vocabulary data for HSK levels 1 and 2.
**script.js**: The main JavaScript file responsible for handling user interactions and vocabulary management.
**style.css**: The CSS file for styling the application.

# Features
**Vocabulary Selection**: Users can choose between HSK 1 and HSK 2 vocabulary lists.

**Learning and Review Modes**: Users can switch between learning new words and reviewing previously learned words.

**Spaced Repetition**: The application uses spaced repetition to schedule word reviews based on the user's performance.

**Stats**: Users can see statistics on the number of known words, words mastered, and unseen words.

**Review Queue**: Words due for review are presented to the user in the review mode.

**Mobile Compatibility Warning**: A message is displayed if the application is accessed on a small screen, recommending the use of a larger screen.

# Usage
Open the index.html file in a web browser on a larger screen (due to the mobile screen message).

Choose between HSK 1 and HSK 2 vocabulary lists by clicking the respective buttons.

Select a learning mode: "Learn New Words" or "Review."

Words are presented to the user one at a time. Users can mark words as known or unknown.

The application schedules word reviews based on the spaced repetition algorithm and tracks user statistics.

User progress is stored in local storage. 

# Preview

![image](https://github.com/dimicodes/HSK-Hero/assets/45632694/7359602e-8f1a-48cb-acaf-c8d8b66aa2a6)

![image](https://github.com/dimicodes/HSK-Hero/assets/45632694/e313e798-e46b-4e36-bed1-196033e1ac36)

