// Gestion simple du formulaire
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Merci ! Votre message a été envoyé. Nous vous répondrons rapidement.");
  this.reset();
});
