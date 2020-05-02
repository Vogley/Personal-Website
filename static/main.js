//Animation helper library
AOS.init();

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



//Pop-Up function
function infoPopUp() {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function infoPopOff() {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


//Toggle Bio
function openBio() {
    let bio = document.getElementById("bio");
    let openBio = document.getElementById("openBio");
    bio.style.display = "block";
    openBio.style.display = "none";
}

//Toggle Skills
let skillsShow = false;
function toggleSkills() {
    let skills = document.getElementById("skills");
    let arrow = document.getElementById("arrow");
    if(skillsShow) {
        skills.style.height = "0px";
        let children = skills.childNodes;
        for(let i = 0; i < 3; i++) {
            children[2*i + 1].style.display = "none";
        }
    }
    else  {
        skills.style.height = "530px";
        let children = skills.childNodes;
        for(let i = 0; i < 3; i++) {
            children[2*i + 1].style.display = "block";
        }
        let col = document.getElementById("observation");
        mobile = false;
        observer.observe(col);
        
    }

    arrow.classList.toggle("fa-angle-down");
    arrow.classList.toggle("fa-angle-up");
    skillsShow = !skillsShow;
}