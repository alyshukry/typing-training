document.querySelector("#word-count.setting .modifier").value = localStorage.getItem("word-count-setting") || 20
document.querySelector("#colored-keys.setting .modifier").checked = (localStorage.getItem("colored-keys-setting") === "true") || false
document.querySelector("#capitalise.setting .modifier").checked = (localStorage.getItem("capitalise-setting") === "true") || false
document.querySelector("#punctuation.setting .modifier").checked = (localStorage.getItem("punctuation-setting") === "true") || false

function checkSetting(setting) {
    if (setting.type === "checkbox") {
        localStorage.setItem(`${setting.parentElement.id}-setting`, setting.checked)
    }
    if (setting.type === "number") {
        localStorage.setItem(`${setting.parentElement.id}-setting`, setting.value || 20)
    }    
}

function applySettings() {
    document.querySelectorAll(".setting .modifier").forEach((setting) => {
        checkSetting(setting)
    })
}