const colors = ["rgba(133,122,200)", "pink", "#d9b0ffff", "#ddff55ff", "#557dffff", "#ddff55ff", "#69ffebff", "#ff3abaff"];

const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");

const colorPanel = document.querySelector("#colorPanel");
const colorText = document.querySelector("#colorCode");

function randomColor()
{
    console.log('First button got clicked!');
    let colorIndex = Math.floor(Math.random()*colors.length);
    console.log(colorIndex);

    colorPanel.style.backgroundColor = colors[colorIndex];
    colorText.innerText = colors[colorIndex];
}

btn1.addEventListener('click', randomColor); // On click, we are summoning haha the function above. 

// rgba(133,122,200) – @home use this format to change the colors. (stands for red, green, blue (and alpha))
// Values should be: 0 <= r, g, b <= 255 – it will generate numerous or infinite random colors. 

// Next one, randomize every digit = from 0 up to f

// Video I learned from: https://youtu.be/JNwZIC-CFzI

function randomRGB() {

let red = Math.floor(Math.random() * 256); //Choose value between 0 to 255
let green = Math.floor(Math.random() * 256); //Choose value between 0 to 255
let blue = Math.floor(Math.random() * 256); //Choose value between 0 to 255
let color = `rgb(${red}, ${green}, ${blue})`; //CSS colour string - a template literal with backtics. Can be written to CSS as well.

console.log(color);

const colorPanel = document.querySelector("#colorPanel");
const colorText = document.querySelector("#colorCode");

colorPanel.style.backgroundColor = color;
colorText.innerText = color;

}

btn2.addEventListener('click', randomRGB);

// Video I learned from: https://www.youtube.com/watch?v=UH6jWex-Pik

function randomHEX() {
   
const hexDigits= "0123456789abcdef";
let color = "#";

// Six random digits
for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * 16); //Choose digits between 0–16
    color += hexDigits[randomIndex];
}

console.log(color);

const colorPanel = document.querySelector("#colorPanel");
const colorText  = document.querySelector("#colorCode");

colorPanel.style.backgroundColor = color;
colorText.innerText = color;
}

btn3.addEventListener('click', randomHEX);
