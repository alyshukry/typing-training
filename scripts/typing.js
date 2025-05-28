import { spawnConfetti } from "../lib/confetti.js"

let text = ""
let textLength
const textDisplay = document.querySelector("#text-display")
const textInput = document.querySelector("#text-input")
const inputMirror = document.querySelector("#input-mirror")

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
        textDisplay.innerHTML = text.split("").map(char => `<span class="char">${char}</span>`).join("")
        // Define the spans
        characters = document.querySelectorAll(".char")
        characters[0].classList.add("current")

        textLength = text.length
    })
    
let statsInterval
let textDone = 0
function textFinished() { // Runs when user types out all of the text
    textDone = 1

    document.removeEventListener("keydown", keyPressed) // Remove listener to avoid errors
    
    // Stop updating the stats
    updateStats() // One last update
    clearInterval(statsInterval)
    
    spawnConfetti({x: "max", y: "center", velXRange: [-10, -1], velYRange: [-10, -1]})
    spawnConfetti({x: 0, y: "center", velXRange: [1, 10], velYRange: [-10, -1]})
}
    
let started = 0
let currentIndex = 0
let typedBefore = 0
let mistakes = 0
let startTime
let textOffset = -1 // -1 to make it start going up only after second line
let sameMistake = 0 // To not penalise every single wrong character

document.addEventListener("input", keyPressed) // Detect key presses

function keyPressed(event) {
    // Stop detecting when user finishes
    if (textDone === 1) return

    if (text.startsWith(textInput.value)) { // Check if input is the same as the beginning of the text
        sameMistake = 0 // Reset to indicate that mistake has been corrected and mistakes can count again

        // Gets the index of the character the user should be typing
        currentIndex = textInput.value.length + typedBefore - 1
        // Adds the .current class to the current character
        const chars = Array.from(document.querySelectorAll("#text-display .char"))
        document.querySelectorAll("#text-display .char").forEach((char) => char.classList.remove("current"))
        if (chars[currentIndex + 1]) chars[currentIndex + 1].classList.add("current") // If statement prevents error at the end of the text

        // "|| 0" prevents error in console at the end of the text
        const currentRow = document.querySelector(".current.char")?.offsetTop || 0
        const nextRow = document.querySelector(".current.char")?.nextElementSibling?.offsetTop || 0
        // Move text up
        if (currentRow < nextRow) {
            textOffset += 1
            // Move all the characters up one line
            document.querySelectorAll(".char").forEach((char) => {
                char.style.top = `-${textOffset * 1.5}rem`
            })
        }
        
        if (event.data === " ") { // Check if at the end of the word
            typedBefore += textInput.value.length // Gets added to the "currentIndex", this keeps track of all the previous characters written

            text = text.slice(textInput.value.length) // Remove the first part of the text so the next inputs can match
            textInput.value = "" // Clear the input
        }
    }
    else if (sameMistake === 0) {
        sameMistake = 1
        mistakes++
    }

    // Update text input mirror
    inputMirror.innerHTML = textInput.value.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('')

    // Check if character is correct or not to add class
    const chars = Array.from(document.querySelectorAll("#input-mirror .char"))
    chars.forEach((char, i) => {
        if (char.textContent === text[i]) {
            if (!char.parentElement.querySelector('.incorrect')) char.classList.add("correct") // Check if there was an incorrect character before
            else char.classList.add("incorrect") // If there is then this char is definitely incorrect

        }   else char.classList.add("incorrect")
    })

    // User finished text
    if (textLength === currentIndex + 1) textFinished()

    // User started the test
    if (started === 0) startTime = Date.now()
    started = 1
}

let accuracyStat
let wpmStat
function updateStats() {
    const characters = document.querySelectorAll("#text-display .char") // Group of sibling characters
    
    // Calculate accuracyStat
    accuracyStat = ((1 - mistakes / (textLength)) * 100).toFixed(2)
    document.querySelector("#accuracy").innerHTML = `${accuracyStat}%`
    
    // Calculate "wpmStat" based on spaces (words) before current position
    const spacesBeforeCurrent = Array.from(characters)
        .slice(0, textLength - 1)
        .filter(span => span.textContent === ' ').length + 1
    const timeElapsed = (Date.now() - startTime) / 60000 // minutes
    wpmStat = timeElapsed > 0 ? (spacesBeforeCurrent / timeElapsed).toFixed(2) : '000.00'
    document.querySelector("#wpm").innerHTML = `${wpmStat} wpm`
}