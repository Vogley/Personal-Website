//Observer for Animations
let options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
}
let animated = false;
let mobile = (screen.width <= 640);


let callback = (entries, observer) => { 
    entries.forEach(entry => {
        if(entry.isIntersecting && !animated && !mobile) {
            console.log("hello");
            $(".skill-bar > span").each(function() {
                $(this)
                    .data("origWidth", $(this).width()/$("#skills").width())
                    .width(0)
                    .animate({
                    width: $(this).data("origWidth")*200 + "%" // or + "%" if fluid
                    }, 1200);
            });

            animated = true;
        }
    });
};

let target = document.querySelector('#skills');
let observer = new IntersectionObserver(callback, options);
observer.observe(target);