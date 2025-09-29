// logic for nav bar hide and show.

let navClose = document.querySelector(".close")
let nav = document.querySelector(".nav")
const more = document.querySelector(".navHiddenImg")
const navHidden = document.querySelector(".hiddenNav")


console.log(nav)

navClose.addEventListener("click", () => {
    //   nav.classList.add("slide")
    nav.style.display = "none"
    navHidden.style.display = "block"
})

more.addEventListener("click", () => {
  
    navHidden.style.display = "none"
    nav.style.display = "block"

})