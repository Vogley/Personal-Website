
//Observer for Animations
let options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
}
let animated = false
console.log(window.screenX);

let callback = (entries, observer) => { 
    entries.forEach(entry => {
        if(entry.isIntersecting && !animated) {
            $(".skill-bar > span").each(function() {
                console.log($(this).width()/$("#skills").width());
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