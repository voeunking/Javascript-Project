
let notLogin = document.getElementById('notLoing');
console.log(notLogin)
let register = document.querySelector('.register-container')
function display(){
    let login = document.getElementById('.login');
    login.style.display = 'block';
}

register.addEventListener('click',display)