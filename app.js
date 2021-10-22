// dom elements
var elements = {
    countdownForm: document.getElementById('countdownForm'),
    inputContainer: document.getElementById('input-container'),
    inputTitle: document.getElementById('title'),
    dateEl: document.getElementById('date-picker'),
    countdownEl: document.getElementById('countdown'),
    countdownElTitle: document.getElementById('countdown-title'),
    countdownBtn: document.getElementById('countdown-button'),
    timeElements: document.querySelectorAll('span'),
    completeEl: document.getElementById('complete'),
    completeElInfo: document.getElementById('complete-info'),
    completeBtn: document.getElementById('complete-button')
};
var today = new Date();
var timerId;
// functions
var setMinDate = function () {
    var year = today.getFullYear();
    var month = ("" + (today.getMonth() + 1)).padStart(2, '0');
    var date = ("" + today.getDate()).padStart(2, '0');
    elements.dateEl.setAttribute('min', year + "-" + month + "-" + date);
};
var getInput = function () {
    var _a = elements.dateEl.value.split('-'), year = _a[0], month = _a[1], date = _a[2];
    var input = {
        title: elements.inputTitle.value,
        timeStamp: {
            date: +date,
            month: +month - 1,
            year: +year
        }
    };
    return input;
};
// calculates the remaning time from today based on future time
var calcRemaningTime = function (futureTime) {
    var title = futureTime.title;
    var _a = futureTime.timeStamp, date = _a.date, month = _a.month, year = _a.year;
    var totalTime = (+new Date(year, month, date, 0, 0, 0) - Date.now()) / 1000;
    // all remaning time
    var days = Math.floor(totalTime / 60 / 60 / 24);
    totalTime %= 86400;
    var hours = Math.floor(totalTime / 60 / 60);
    totalTime %= 3600;
    var minutes = Math.floor(totalTime / 60);
    totalTime %= 60;
    var seconds = Math.floor(totalTime);
    return {
        title: title,
        timeStamp: {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    };
};
// displays the remaning time calculated by calRemaningTime
var displayRemaningTime = function (timeLeft) {
    var title = timeLeft.title;
    var _a = timeLeft.timeStamp, days = _a.days, hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
    var allTimes = [days, hours, minutes, seconds];
    elements.countdownElTitle.textContent = title;
    elements.timeElements.forEach(function (time, i) { return (time.textContent = "" + allTimes[i]); });
    elements.inputContainer.setAttribute('hidden', '');
    elements.countdownEl.removeAttribute('hidden');
};
var calcAndDisplayRemaningTime = function (input) {
    // immediately run once
    // calculate the remaning time
    var remaningTime = calcRemaningTime(input);
    // display the remaning time
    displayRemaningTime(remaningTime);
    timerId = setInterval(function () {
        // calculate the remaning time
        var remaningTime = calcRemaningTime(input);
        // display the remaning time
        displayRemaningTime(remaningTime);
    }, 1000);
};
var saveTime = function (input) {
    return localStorage.setItem('previouslySetTime', JSON.stringify(input));
};
var clearTime = function () {
    clearInterval(timerId);
    localStorage.removeItem('previouslySetTime');
};
var retriveTime = function () {
    var input = localStorage.getItem('previouslySetTime');
    if (!input)
        return;
    return JSON.parse(input);
};
var resetCountdown = function () {
    clearTime();
    elements.timeElements.forEach(function (time) { var _a; return (_a = time.firstElementChild) === null || _a === void 0 ? void 0 : _a.remove(); });
    elements.inputContainer.removeAttribute('hidden');
    elements.countdownEl.setAttribute('hidden', '');
};
// calculates and displayes the remaning time
var presentRemaningTime = function () {
    // user input
    var input = getInput();
    // save user input to localStorage
    saveTime(input);
    //   display remaning time
    calcAndDisplayRemaningTime(input);
};
var initialize = function () {
    // sets the minumum date of the date picker to today
    setMinDate();
    // load save timer if exists
    if (retriveTime()) {
        // get the saved input
        var input = retriveTime();
        // calculate remaning time based on saved input
        calcAndDisplayRemaningTime(input);
    }
};
initialize();
// event listeners
// submit handler
elements.countdownForm.addEventListener('submit', function (e) {
    e.preventDefault();
    presentRemaningTime();
});
// reset timer handler
elements.countdownBtn.addEventListener('click', resetCountdown);
