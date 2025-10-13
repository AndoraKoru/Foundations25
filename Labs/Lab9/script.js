
let grades = [50,89,75,84,99, 52];
let sum = 0;

//Using a normal array indexing
for(let i = 0; i<grades.length; i++)
{  
    sum += grades [i];
}

console.log(sum);
let result = sum / grades.length;
console.log(result);

// Using for ... of loop
sum = 0;
for(let item of grades) // item will automaically be ofe of grades
{
    sum+= item;
}

console.log(sum);
result = sum / grades.length;
console.log(result);

// % means every Nth item, so i%3 is every ...? 

/* for(let i = 0; i<grades.length; i++)
{  
    if (i%3 == 0);
    sum += grades [i];
    console.log(grades[i]);
}
*/
const countries = ["Germany", "France", "Italy", "Japan", "Estonia"];
//let country1 = countries[0];
//let country2 = countries[1];
//let country3 = countries[2];


// let [country1, , country3] = countries;
// ... makes country3 an array

let country2 = 
[country1, ,...country3] = countries;
console.log(country1, country3);

/*countries.forEach((value,index) => { 
    console.log("This is ", value, "Of index", index);
})
*/

countries.forEach(printNum);

//forEach
countries.forEach((value, index) =>{
    console.log("This is",value, "of index", index);
})

// same same but longer for forEach
countries.forEach(printNum);

function printNum(value, index)
{
    //console.log("This is",value, "of index", index);
}

const numbers = [13, 23, 8, 42, 4];
const firstLargeNumber = numbers.find(num => num  === 5);

console.log(firstLargeNumber);

// If not (!blablabla)


// After find some sort of check comes after like this one here 
if(firstLargeNumber)
{
    console.log("Hey we have found the number");   
}
else
{
    console.log("Sorry, could not find the number you are looking for!!");
    
}

