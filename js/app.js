let notLogin = document.querySelector('.link span a');
let register = document.querySelector('.register-container')
let login = document.getElementById('login');
let re_form = document.getElementById('re-form');
function display(){
    login.style.display = 'block';
    register.style.display ='none';
}
notLogin.addEventListener('click',display)
function show_regist(){
     login.style.display = 'none';
     register.style.display = 'block'
}
re_form.addEventListener('click',show_regist)