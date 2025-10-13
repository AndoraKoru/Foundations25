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

