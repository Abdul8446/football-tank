const buttons = document.querySelectorAll('.nav-links');

// loop through all the date buttons and add an event listener
buttons.forEach(button => {
  button.addEventListener('click', function() {

    // remove 'active' class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // add 'active' class to the clicked button
    this.classList.add('active');
  });
});

// set the first button as active on page load
buttons[0].classList.add('active');


// function setActiveLink(event) {
//     // Remove 'active' class from all links
//     const navLinks = document.querySelectorAll('.navlinks');
//     navLinks.forEach(link => link.classList.remove('active'));
  
//     // Add 'active' class to clicked link
//     event.target.classList.add('active');
// }

// module.exports=setActiveLink