// ===== MOBILE MENU TOGGLE =====
const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuBtn.classList.toggle("open");
    });
}



// ===== SMOOTH SCROLL =====
function scrollToSection(sectionID) {
    const target = document.getElementById(sectionID);
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}



// ===== AUTO-GENERATE & DOWNLOAD INTAKE FORM =====
const downloadBtn = document.getElementById("downloadIntake");

if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {

        const intakeText =
`LIFE HACK AGENCY • CLIENT INTAKE FORM
-------------------------------------------
Name: ______________________________

Phone: ______________________________

Email: ______________________________

Business Name (optional):
___________________________________

What type of website/app do you need?
___________________________________

Describe your project:
___________________________________

Preferred Contact Time:
___________________________________

Submit this form to: StaytonCoryJoseph@gmail.com`;

        const blob = new Blob([intakeText], { type: "text/plain" });
        const fileURL = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileURL;
        a.download = "LifeHackAgency_IntakeForm.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(fileURL);
    });
}



// ===== FORM VALIDATION =====
const intakeForm = document.getElementById("intakeForm");

if (intakeForm) {
    intakeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("clientName");
        const phone = document.getElementById("clientPhone");
        const email = document.getElementById("clientEmail");

        if (name.value.trim() === "" || phone.value.trim() === "" || email.value.trim() === "") {
            alert("Please fill out all fields before submitting.");
            return;
        }

        alert("Thank you! Your info has been captured. I will reach out shortly.");
        intakeForm.reset();
    });
}



// ===== CLICK TO CALL =====
const callBtn = document.querySelectorAll(".call-now");

callBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = "tel:6828889241";
    });
});



// ===== BUTTON FLASH EFFECT =====
const flashButtons = document.querySelectorAll(".cta, .call-now, #downloadIntake");

flashButtons.forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.style.opacity = ".6";
    });
    btn.addEventListener("mouseup", () => {
        btn.style.opacity = "1";
    });
});
