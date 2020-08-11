
let nav = document.querySelector('.navbar');
document.querySelector('#menu').onclick = function() {
    if (nav.style.height === '160px') {
        nav.style.height = '40px';
    } else {
        nav.style.height = '160px';
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth > '600') {
        document.querySelector('.navbar').style.height = '40px';
    }
});


