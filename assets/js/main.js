/* ============================================================
   Mobile navigation toggle
   ============================================================ */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!toggle || !links) return;

  // Re-parent the drawer to <body> so it escapes the header's stacking
  // context. Fixes the iOS Safari issue where backdrop-filter on a
  // parent traps fixed descendants.
  if (links.parentElement && links.parentElement !== document.body) {
    document.body.appendChild(links);
  }

  function closeMenu() {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    toggle.classList.add("is-open");
    links.classList.add("is-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle.addEventListener("click", function () {
    if (links.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close drawer when any nav link is tapped
  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close drawer on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Close drawer if resized up to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 980 && links.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();

const steps = Array.from(document.querySelectorAll(".form-step"));
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const enquiryForm = document.getElementById("enquiryForm");
const formSuccess = document.getElementById("formSuccess");

if (steps.length) {
  let currentStep = 0;

  function getCurrentField(stepElement) {
    return stepElement.querySelector("input, select, textarea");
  }

  function validateStep() {
    const field = getCurrentField(steps[currentStep]);
    if (!field) return true;

    const value = field.value.trim();

    if (field.tagName === "SELECT") {
      return value !== "";
    }

    if (field.type === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (field.hasAttribute("minlength")) {
      return value.length >= parseInt(field.getAttribute("minlength"), 10);
    }

    return value !== "";
  }

  function goNext() {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep += 1;
      showStep(currentStep);
    }
  }

  function goPrev() {
    if (currentStep > 0) {
      currentStep -= 1;
      showStep(currentStep);
    }
  }

  function updateButtons() {
    prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
    nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
    submitBtn.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";
  }

  function updateProgress() {
    const progressPercent = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });

    updateButtons();
    updateProgress();

    const currentField = getCurrentField(steps[index]);

    if (currentField) {
      setTimeout(() => currentField.focus(), 180);
    }
  }

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  steps.forEach((step) => {
    const field = getCurrentField(step);
    if (!field) return;

    field.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      e.preventDefault();

      if (currentStep === steps.length - 1) {
        enquiryForm.requestSubmit();
        return;
      }

      goNext();
    });
  });

  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    steps.forEach((step) => {
      step.classList.remove("active");
    });

    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";

    progressFill.style.width = "100%";
    progressText.textContent = "Enquiry complete";

    formSuccess.classList.add("show");
  });

  showStep(currentStep);
}