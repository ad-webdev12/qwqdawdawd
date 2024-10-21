var navOffset = $("#home").offset().top;
console.log(navOffset);

$(window).scroll(function(){
	
	var scrollPos = $(window).scrollTop();
	console.log(scrollPos);
	
	if(scrollPos > navOffset){
	   $("nav").addClass("dark-background");
	   }
		else{
	   $("nav").removeClass("dark-background");
	   } 
})


$(".mobile-menu").click(function(){
	$("#header nav ul").toggleClass("show");
	
});


$(document).ready(function() {
  var popupShown = false;
  var learnSection = $(".learn-teaser");

  $(window).scroll(function() {
    var scrollPos = $(window).scrollTop();
    var learnOffset = learnSection.offset().top;

    if (!popupShown && scrollPos > learnOffset - $(window).height() / 2) {
      $("#popup").fadeIn();
      popupShown = true;
    }
  });

  $("#close-popup").click(function() {
    $("#popup").fadeOut();
  });

  $("#email-form").submit(function(e) {
    e.preventDefault();
    var email = $("#email-input").val();
    
    // Here you would typically send the email to your server or a service
    // For this example, we'll just log it to the console
    console.log("Email submitted:", email);
    
    // You can replace the alert with a more elegant solution
    alert("Thank you for subscribing!");
    
    $("#popup").fadeOut();
  });
});



