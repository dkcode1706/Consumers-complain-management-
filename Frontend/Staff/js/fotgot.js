// geting forgot page

const forgot = document.querySelector(".forgotPage"); 
const forgotbtn = document.querySelector(".forgot")
const back  = document.querySelector(".back")
 
// geting forgot button 
const btn = document.querySelector(".forgotFormPageBtn")

console.log(forgot, forgotbtn , )

// forgot page showing code

forgotbtn.addEventListener("click", () => {
 
       forgot.style.display = forgot.style.display === "block" ? "none" : "block";
})

// code to hide forgot pannel.

back.addEventListener("click", ()=>{
    forgot.style.display = "none";
});

// showing process for recover password.

btn.addEventListener("click", ()=>{
    alert("A password is sent to your mail with encription.")
})



