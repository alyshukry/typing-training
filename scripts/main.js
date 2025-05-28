const row0Keys = ["backquote", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "digit0", "minus", "equal", "backspace"]
const row1Keys = ["tab", "keyq", "keyw", "keye", "keyr", "keyt", "keyy", "keyu", "keyi", "keyo", "keyp", "bracketleft", "bracketright", "backslash"]
const row2Keys = ["capslock", "keya", "keys", "keyd", "keyf", "keyg", "keyh", "keyj", "keyk", "keyl", "semicolon", "quote", "enter"]
const row3Keys = ["shiftleft", "keyz", "keyx", "keyc", "keyv", "keyb", "keyn", "keym", "comma", "period", "slash", "shiftright"]
const row4Keys = ["controlleft", "altleft", "space", "altright", "controlright"]

// Pressing and unpressing logic
document.addEventListener("keydown", function(event) {
    if (document.querySelector(`#${event.code.toLowerCase()}.key`)) document.querySelector(`#${event.code.toLowerCase()}.key`).classList.add("active")
})
document.addEventListener("keyup", function(event) {
    if (document.querySelector(`#${event.code.toLowerCase()}.key`)) document.querySelector(`#${event.code.toLowerCase()}.key`).classList.remove("active")
})

window.addEventListener("blur", () => { // Unpresses all keys if user unfocuses (fixes 'Tabbing out' and 'Tabbing' resulting in persistently pressed keys)
    document.querySelectorAll(".key.active").forEach((key) => {
        key.classList.remove("active")
    })
})

// Convert Shiftable characters
const shiftMapping = {
    'backquote': ['`', '~'],
    'digit1': ['1', '!'],
    'digit2': ['2', '@'],
    'digit3': ['3', '#'],
    'digit4': ['4', '$'],
    'digit5': ['5', '%'],
    'digit6': ['6', '^'],
    'digit7': ['7', '&'],
    'digit8': ['8', '*'],
    'digit9': ['9', '('],
    'digit0': ['0', ')'],
    'minus': ['-', '_'],
    'equal': ['=', '+'],
    'bracketleft': ['[', '{'],
    'bracketright': [']', '}'],
    'backslash': ['\\', '|'],
    'semicolon': [';', ':'],
    'quote': ["'", '"'],
    'comma': [',', '<'],
    'period': ['.', '>'],
    'slash': ['/', '?']
}

function updateKeys(isShifted) {
    Object.entries(shiftMapping).forEach(([key, [normal, shifted]]) => {
        document.querySelector(`#${key}.key`).innerHTML = isShifted ? shifted : normal
    })
}

document.addEventListener("keydown", e => e.key === "Shift" && updateKeys(true))
document.addEventListener("keyup", e => e.key === "Shift" && updateKeys(false))

// Key press animation sequence
function keyPressSequence(keys, interval) {
    keys.forEach((key, index) => {
        setTimeout(() => {
            document.querySelector(`#${key}`).classList.add("active")

            setTimeout(() => {
                document.querySelector(`#${key}`).classList.remove("active")
            }, interval)

        }, interval * index)
    })
}

// Animation for all RowKeyss
function welcomeAnimation() {
    setTimeout(() => {
        keyPressSequence([...row0Keys], 75)
        keyPressSequence([...row1Keys].reverse(), 75)
        keyPressSequence([...row2Keys], 75)
        keyPressSequence([...row3Keys].reverse(), 75)
        keyPressSequence([...row4Keys], 75)
    }, 0)
    setTimeout(() => {
        keyPressSequence([...row0Keys].reverse(), 75)
        keyPressSequence([...row1Keys], 75)
        keyPressSequence([...row2Keys].reverse(), 75)
        keyPressSequence([...row3Keys], 75)
        keyPressSequence([...row4Keys].reverse(), 75)
    }, row0Keys.length * 75)
}

document.querySelector("#text-display").style.width = "calc(" + document.querySelector("#keyboard").offsetWidth + "px - 1.5rem)";