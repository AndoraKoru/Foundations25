const menuList = [
    {
      id: 1,
      title: "buttermilk pancakes",
      category: "breakfast",
      price: 15.99,
      img: "./images/item-1.jpeg",
      desc: `I'm baby woke mlkshk wolf bitters live-edge blue bottle, hammock freegan copper mug whatever cold-pressed `,
    },
    {
      id: 2,
      title: "diner double",
      category: "lunch",
      price: 13.99,
      img: "./images/item-2.jpeg",
      desc: `vaporware iPhone mumblecore selvage raw denim slow-carb leggings gochujang helvetica man braid jianbing. Marfa thundercats `,
    },
    {
      id: 3,
      title: "godzilla milkshake",
      category: "shakes",
      price: 6.99,
      img: "./images/item-3.jpeg",
      desc: `ombucha chillwave fanny pack 3 wolf moon street art photo booth before they sold out organic viral.`,
    },
    {
      id: 4,
      title: "country delight",
      category: "breakfast",
      price: 20.99,
      img: "./images/item-4.jpeg",
      desc: `Shabby chic keffiyeh neutra snackwave pork belly shoreditch. Prism austin mlkshk truffaut, `,
    },
    {
      id: 5,
      title: "egg attack",
      category: "lunch",
      price: 22.99,
      img: "./images/item-5.jpeg",
      desc: `franzen vegan pabst bicycle rights kickstarter pinterest meditation farm-to-table 90's pop-up `,
    },
    {
      id: 6,
      title: "oreo dream",
      category: "shakes",
      price: 18.99,
      img: "./images/item-6.jpeg",
      desc: `Portland chicharrones ethical edison bulb, palo santo craft beer chia heirloom iPhone everyday`,
    },
    {
      id: 7,
      title: "bacon overflow",
      category: "breakfast",
      price: 8.99,
      img: "./images/item-7.jpeg",
      desc: `carry jianbing normcore freegan. Viral single-origin coffee live-edge, pork belly cloud bread iceland put a bird `,
    },
    {
      id: 8,
      title: "american classic",
      category: "lunch",
      price: 12.99,
      img: "./images/item-8.jpeg",
      desc: `on it tumblr kickstarter thundercats migas everyday carry squid palo santo leggings. Food truck truffaut  `,
    },
    {
      id: 9,
      title: "quarantine buddy",
      category: "shakes",
      price: 16.99,
      img: "./images/item-9.jpeg",
      desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
    },
    {
      id: 10,
      title: "Chicken nuggets",
      category: "kids",
      price: 5.99,
      img: "./images/item-10.jpeg",
      desc: `Dinosaur nuggets`,
    },
  ];
  
 /* return `<div class="menu-item-col">
  <img src= alt=>
  <div class="item-info">
      <header>
          <h4></h4>
          <h4 class="price"></h4>
      </header>
      <p class="item-text"></p>
  </div>
</div>`
*/

/*
return `<button class="filter-btn" type="button" data-id=  >  </button>`
*/
let sectionCenter = document.querySelector(".menu-wrap-section"); //Accessing div
const btnContainer = document.querySelector(".btn-container");

window.addEventListener("DOMContentLoaded", function () {
  displayMenuItems(menuList);
});

// Showing menu items
const displayMenuItems = (menuItems) => {
//  let menuItem = menuList[2];
//  console.log(menuItem);

  let displayMenu = menuItems.map((menuItem) => {

  
  return `<div class="menu-item-col">
    <img src=${menuItem.img} alt=${menuItem.title}>
    <div class="item-info">
        <header>
            <h4>${menuItem.title}</h4>
            <h4 class="price">${menuItem.price}€</h4>
        </header>
        <p class="item-text">${menuItem.desc}</p>
    </div>
  </div>`

  });

//console.log(displayMenu); //This is an array of strings and it will show commas inbeetbeen items
displayMenu = displayMenu.join(""); //Space inbetween items
sectionCenter.innerHTML = displayMenu; //Letting to modify
}

const displayMenuButtons = () => {

  const categories = menuList.reduce((accumulator, currentItem) => {
    if (accumulator.includes(currentItem.category))
     console.log("Category exists");
    else
      {
        console.log("Category is missing");
        accumulator.push(currentItem.category);
      }
    return accumulator;
  },["all"])

  console.log(categories);

  const categoryBtns = categories.map((itemCategory) => {
    return `<button class="filter-btn" type="button" data-id=${itemCategory}  > ${itemCategory}  </button>`;
  }).join("");

  btnContainer.innerHTML = categoryBtns;
  

const filterBtns = document.querySelectorAll(".filter-btn");
//console.log(filterBtns);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e)=> {
    //console.log(e.currentTarget.dataset.id);
    const category = e.currentTarget.dataset.id;

    const menuSubList = menuList.filter((menuItem) => menuItem.category === category);
    //console.log(menuSubList);

    if(category === "all")
      displayMenuItems(menuList);
    else
    displayMenuItems(menuSubList);
  })
})
}

displayMenuButtons();