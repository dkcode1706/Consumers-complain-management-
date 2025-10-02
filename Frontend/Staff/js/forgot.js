// forgot.js
document.addEventListener("DOMContentLoaded", () => {
  // Selectors (works with either id="#forgotBtn" or class=".forgot")
  const forgotBtn =
    document.querySelector("#forgotBtn") || document.querySelector(".forgot");
  const popup = document.getElementById("forgotPopup");
  const overlay = document.getElementById("overlay");
  const closePopup = document.getElementById("closePopup");
  const forgotForm = document.querySelector(".forgot-form");

  // Defensive checks
  if (!forgotBtn) {
    console.error(
      "Forgot button not found. Make sure there is <a id='forgotBtn' ...> or <a class='forgot' ...>"
    );
    return;
  }
  if (!popup || !overlay || !closePopup || !forgotForm) {
    console.error(
      "Popup elements missing. Check #forgotPopup, #overlay, #closePopup, .forgot-form exist."
    );
    return;
  }

  const showPopup = () => {
    popup.style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden"; // disable page scroll when modal open
    // move keyboard focus into modal for accessibility
    const firstInput = popup.querySelector("input");
    if (firstInput) firstInput.focus();
  };

  const hidePopup = () => {
    popup.style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = ""; // restore scrolling
    // return focus to trigger
    forgotBtn.focus();
  };

  // open
  forgotBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showPopup();
  });

  // close handlers
  closePopup.addEventListener("click", (e) => {
    e.preventDefault();
    hidePopup();
  });

  overlay.addEventListener("click", hidePopup);

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePopup();
  });

  // handle form submit (prevent page reload)
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = forgotForm.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email) {
      alert("Please enter your email.");
      if (emailInput) emailInput.focus();
      return;
    }

    // Replace the following with your actual "send reset link" logic / fetch API request
    console.log("Request password recovery for:", email);

    // Example UX flow:
    hidePopup();
    alert("If this email is registered, a recovery link has been sent.");
    forgotForm.reset();
  });
});
