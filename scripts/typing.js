let text = "Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro Hello bro "
const wordCount = text.trim().split(/\s+/).length
const textArea = document.querySelector("#text-area")

// Split each character into a span
textArea.innerHTML = text.split("").map(letter => `<span class="char">${letter}</span>`).join("")

const characters = document.querySelectorAll(".char")
characters[0].classList.add("current")

let currentCharacterIndex = 0
let mistakes = 0
let startTime
let textOffset = -1 // -1 to make it start going up only after second line
document.addEventListener("keydown", keyPressed) // Detect key presses

function textFinished() { // Runs when user types out all of the text
    console.log(`done, ${((1 - mistakes / characters.length) * 100).toFixed(2)}% accuracy, wpm: ${(wordCount / ((Date.now() - startTime) / 60000)).toFixed(2)}`)
    document.removeEventListener("keydown", keyPressed) // Remove listener to avoid errors
}

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
}

Array.from(document.querySelectorAll('.char')).filter(span => span.textContent === ' ').forEach(span => span.classList.add("space"))