let notLogin = document.querySelector('.link span a');
let register = document.querySelector('.register-container')
let login = document.getElementById('login');
let re_form = document.getElementById('re-form');
// login
function display(){
    login.style.display = 'block';
    register.style.display ='none';
}
notLogin.addEventListener('click',display)
// register
function show_regist(){
     login.style.display = 'none';
     register.style.display = 'block'
}
re_form.addEventListener('click',show_regist)

// GO TO DASHBORD
let register_button = document.getElementById('register-login')
register_button.addEventListener('click', function(){
    let main = document.getElementById('main');
    console.log(main)
    main.style.display = 'block';
    register.style.display ='none';
  
})
// incorrect
let logo = document.querySelector('.logo')
logo.addEventListener('click', function(){
     let input = document.getElementsByName('inputText');
      console.log(input.value)
})

// for (let Input of input){
//     console.log(Input.value)
// }
