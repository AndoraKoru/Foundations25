const daysElement = document.getElementById("days");
const hoursElement = document.querySelector("#hours");
const minutesElement = document.querySelector("#minutes");
const secondsElement = document.querySelector("#seconds");

const endDate = new Date(2026, 0, 1);
    console.log(endDate);


function countDown() {

    const currentDate = new Date();
    console.log(currentDate.getTime()/1000);

    const totalSeconds = (endDate - currentDate)/1000;
    console.log(totalSeconds)

    let days = Math.floor(totalSeconds/(24*3600));
    let hours = Math.floor(totalSeconds%(24*3600)/3600);
    let minutes = Math.floor(totalSeconds%(24*3600)%3600/60);
    let seconds = Math.floor(totalSeconds%(24*3600)%3600%60);

    console.log(days, hours, minutes, seconds);
    daysElement.innerHTML = days;
    hoursElement.innerHTML = hours;
    minutesElement.innerHTML = minutes;
    secondsElement.innerHTML = seconds;

}

countDown();

setInterval(countDown, 1000);