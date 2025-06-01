import {spawnConfetti} from "../lib/confetti.js"

const textDisplay = document.querySelector("#text-display")
const textInput = document.querySelector("#text-input")
const inputMirror = document.querySelector("#input-mirror")

let currentIndex = 0
let typedBefore = 0
let startedTest = false
let text = ""
let textLength
let wordCount = localStorage.getItem("wordCount") || 2
export function resetText() {
    startedTest = false
    document.addEventListener("input", keyPressed) // Detect key presses

    // Reset
    typedBefore = 0
    currentIndex = 0
    textInput.value = ""
    inputMirror.innerHTML = ""

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
    }   resetText()
    window.resetText = resetText
    
let statsInterval
let startTime
function startTest() {
    // Global variable to know if game is running
    startedTest = true

    statsInterval = setInterval(updateStats, 500)
    startTime = Date.now()
}

function textFinished() { // Runs when user types out all of the text
    document.removeEventListener("input", keyPressed) // Remove listener to avoid errors
    
    // Stop updating the stats
    updateStats() // One last update
    clearInterval(statsInterval)

    textDisplay.innerHTML = `<div id="end-text">
    Typed ${wordCount} words in ${(timeElapsed / 1000).toFixed(3)} seconds<br>${wpmStat} WPM (${(getPercentile(wpmStat) * 100).toFixed(2)}th percentile)<br>${accuracyStat}% accuracy
    </div>`
    
    spawnConfetti({x: "max", y: "center", velXRange: [-10, -1], velYRange: [-10, -1]})
    spawnConfetti({x: 0, y: "center", velXRange: [1, 10], velYRange: [-10, -1]})
}

let mistakes = 0
let textOffset = -1 // -1 to make it start going up only after second line
let sameMistake = false // To not penalise every single wrong character
function keyPressed(event) {
    if (text.startsWith(textInput.value)) { // Check if input is the same as the beginning of the text
        sameMistake = false // Reset to indicate that mistake has been corrected and mistakes can count again

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
    else if (sameMistake === false) {
        sameMistake = true
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

    // User startedTest the test
    if (startedTest === false) startTest()
}

let accuracyStat
let wpmStat
let timeElapsed
function updateStats() {
    const characters = document.querySelectorAll("#text-display .char:not(.current):not(.current ~ .char)") // Characters before current

    // Calculate accuracyStat
    accuracyStat = ((1 - mistakes / (textLength)) * 100).toFixed(2)
    document.querySelector("#accuracy").innerHTML = `${accuracyStat}%`
    
    // Calculate "wpmStat" based on spaces (words) before current position
    const spacesBeforeCurrent = Array.from(characters)
        .slice(0, textLength - 1)
        .filter(span => span.textContent === ' ').length + 1
    timeElapsed = (Date.now() - startTime) // minutes
    wpmStat = timeElapsed / 60000 > 0 ? (spacesBeforeCurrent / (timeElapsed / 60000)).toFixed(2) : '000.00'
    document.querySelector("#wpm").innerHTML = `${wpmStat} WPM`

}

function getPercentile(wpm) {
  // Using the error function approximation (erf)
  const z = (wpm - 60) / (Math.sqrt(2) * 15)
  const t = 1 / (1 + 0.3275911 * Math.abs(z))
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429

  const erf = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-z * z)
  const sign = z >= 0 ? 1 : -1
  return 0.5 * (1 + sign * erf)
}