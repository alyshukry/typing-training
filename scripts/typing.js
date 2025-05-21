import { spawnConfetti } from "../lib/confetti.js"

let text = ""
const textArea = document.querySelector("#text-area")

const wordCount = 25
let characters
fetch("../assets/pseudo-words.json")
    .then(response => response.json())
    .then((words) => {
        // Adds random amount of words to text
        const wordsArray = Array.isArray(words) ? words : Object.values(words)
        const textWords = Array.from({ length: wordCount }, () => wordsArray[Math.floor(Math.random() * wordsArray.length)])
        text = textWords.join(' ')
    })
    .then(() => {
        // Wait for text to be loaded
        // Split each character into a span
        textArea.innerHTML = text.split("").map(char => `<span class="char">${char}</span>`).join("")
        // Define the spans
        characters = document.querySelectorAll(".char")
        characters[0].classList.add("current")
    })

let currentCharacterIndex = 0
let mistakes = 0
let startTime
let textOffset = -1 // -1 to make it start going up only after second line
document.addEventListener("keydown", keyPressed) // Detect key presses

let statsInterval
function textFinished() { // Runs when user types out all of the text
    document.removeEventListener("keydown", keyPressed) // Remove listener to avoid errors

    // Stop updating the stats
    updateStats() // One last update
    clearInterval(statsInterval)
    
    spawnConfetti({x: "max", y: "center", velXRange: [-10, -1], velYRange: [-10, -1]})
    spawnConfetti({x: 0, y: "center", velXRange: [1, 10], velYRange: [-10, -1]})
}

let started = 0
function keyPressed(event) {
    const userInput = event.key
    // Run this function only if one of the typeable letters is pressed
    if (![
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        "`", "~", ".", ",", "!", "?", "'", '"', ";", ":", " ", "-", "_", "(", ")", "[", "]", "{", "}", "\\"
    ].includes(userInput)) return
    
    // Current character (the one that's supposed to get typed next)
    const currentCharacter = characters[currentCharacterIndex]
    
    // Current row offset to move the entire text upwards when a line is finished
    const currentRow = characters[currentCharacterIndex].offsetTop
    let nextCharRow // Row below 
    if (characters[currentCharacterIndex + 1]) {nextCharRow = characters[currentCharacterIndex + 1].offsetTop} // If statement to prevent error when on the last character of the text
    if (currentRow != nextCharRow) { // If both values aren't equal then user has moved onto another line
        textOffset += 1
        // Move all the characters up one line
        document.querySelectorAll(".char").forEach((char) => {
            char.style.top = `-${textOffset * 1.5}rem`
        })
    }
    
    // Start the timer
    if (currentCharacterIndex === 0) startTime = Date.now()

    if (userInput === currentCharacter.innerHTML) { // User typed in the correct character
        currentCharacter.classList.add("correct")
        currentCharacter.classList.remove("incorrect")
        currentCharacterIndex++
        
        // Checks if current character was last character
        if (currentCharacterIndex === characters.length) {
            textFinished()
            return
        }
        
        // Add the current class to the current letter (after 'currentCharacterIndex' has been incremented)
        characters.forEach((char) => {char.classList.remove("current")})
        characters[currentCharacterIndex].classList.add("current")

    }   else { // User typed in the wrong character
            // Add to their mistakes unless it's the same character they're on
            if (!currentCharacter.classList.contains("incorrect")) mistakes++
            
            currentCharacter.classList.add("incorrect")
            currentCharacter.classList.remove("correct")
    }

    // Start getting user stats
    if (started === 0) {
        statsInterval = setInterval(updateStats, 250)
    }
    
    // User started the test
    started = 1
}

let accuracyStat
let wpmStat
function updateStats() {
    const siblings = document.querySelectorAll(".char") // Group of sibling elements
    const element = document.querySelector(".char.current")
    const currentIndex = Array.from(siblings).indexOf(element)
    
    accuracyStat = ((1 - mistakes / (currentIndex + 1)) * 100).toFixed(2)

    // Calculate accuracyStat
    document.querySelector("#accuracy").innerHTML = `${accuracyStat}%`
    
    // Calculate wpmStat based on spaces (words) before current position
    const spacesBeforeCurrent = Array.from(siblings)
        .slice(0, currentIndex)
        .filter(span => span.textContent === ' ').length + 1
    const timeElapsed = (Date.now() - startTime) / 60000 // minutes
    wpmStat = timeElapsed > 0 ? (spacesBeforeCurrent / timeElapsed).toFixed(2) : '0.00'
    document.querySelector("#wpm").innerHTML = `${wpmStat} wpm`
}

// Add 'space' class to space spans
Array.from(document.querySelectorAll('.char')).filter(span => span.textContent === ' ').forEach(span => span.classList.add("space"))