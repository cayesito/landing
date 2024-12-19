window.addEventListener("scroll", function () {
    let header = document.getElementById("primary_text");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    header.style.opacity = 1 - scrollTop / 500;
});

window.addEventListener("scroll", function () {
    let footer = document.getElementById("footer");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    footer.style.opacity = 1 + scrollTop * 500;
});

const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_r2eagi7';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

