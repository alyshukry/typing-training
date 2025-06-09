if (window.innerWidth <= 768) document.body.innerHTML = "<p style='color:var(--text-color);'>Sorry! This website is only available on desktop devices.</p>";

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

function updateShiftableKeys(isShifted) {
    Object.entries(shiftMapping).forEach(([key, [normal, shifted]]) => {
        document.querySelector(`#${key}.key`).innerHTML = isShifted ? shifted : normal
    })
}

document.addEventListener("keydown", e => e.key === "Shift" && updateShiftableKeys(true))
document.addEventListener("keyup", e => e.key === "Shift" && updateShiftableKeys(false))

// Key press animation sequence
function keyPressSequence(keys, interval) {
    keys.forEach((key, index) => {
        setTimeout(() => {
            document.querySelector(`#${key}`).classList.add("active")
            updateShiftableKeys(!!document.querySelector("#shiftleft.key.active") || document.querySelector("#shiftright.key.active")) // Updates shiftable keys if shift was pressed

            setTimeout(() => {
                document.querySelector(`#${key}`).classList.remove("active")
                updateShiftableKeys(!!document.querySelector("#shiftleft.key.active") || document.querySelector("#shiftright.key.active")) // Updates shiftable keys if shift was pressed
            }, interval * 1.25)

        }, interval * index)
    })
}

// Animation for all RowKeyss
function welcomeAnimation() {
    keyPressSequence(["keyw", "keye", "keyl", "keyc", "keyo", "keym", "keye", "shiftleft", "digit1"], 200)
}

document.querySelector("#text-display").style.width = "calc(" + document.querySelector("#keyboard").offsetWidth + "px - 1.5rem)"

welcomeAnimation()

function addFingerClasses() {
    const fingerAssignments = {
        'pinky-finger': ['backquote', 'tab', 'capslock', 'shiftleft', 'controlleft', 'digit1', 'keyq', 'keya', 'keyz', 'keyp', 'bracketleft', 'bracketright', 'backslash', 'enter', 'semicolon', 'quote', 'slash', 'shiftright', 'controlright', 'digit0', 'minus', 'equal', 'backspace'],
        'ring-finger': ['digit2', 'keyw', 'keys', 'keyx', 'digit9', 'keyo', 'keyl', 'period'],
        'middle-finger': ['digit3', 'keye', 'keyd', 'keyc', 'digit8', 'keyi', 'keyk', 'comma'],
        'leftindex-finger': ['digit4', 'digit5', 'digit6', 'keyr', 'keyt', 'keyf', 'keyg', 'keyv', 'keyb'],
        'rightindex-finger': ['digit6', 'digit7', 'keyy', 'keyh', 'keyn', 'keyu', 'keyj', 'keym'],
        'thumb-finger': ['altleft', 'space', 'altright']
    }

    for (const [fingerClass, keys] of Object.entries(fingerAssignments)) {
        keys.forEach(key => {
            const element = document.querySelector(`#${key}.key`)
            if (element) element.classList.add(fingerClass)
        })
    }
}

if (localStorage.getItem("colored-keys-setting") === "true") addFingerClasses()