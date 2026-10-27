function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function encrypt(passCode){
    let result = "";
    let codeAsciiValue = 0;
    const computerChoice = randomBetween(1, 3);

    if (computerChoice === 1){
        for (const ch of passCode){
            codeAsciiValue = ch.charCodeAt(0) + 14;
            if (codeAsciiValue > 126){
                codeAsciiValue = (codeAsciiValue % 126) + 31;
            }
            result += String.fromCharCode(codeAsciiValue);
        }
        result += String(computerChoice);
    }
    else if (computerChoice === 2){
        for (const ch of passCode){
            codeAsciiValue = ch.charCodeAt(0) + 28;
            if (codeAsciiValue > 126){
                codeAsciiValue = (codeAsciiValue % 126) + 31;
            }
            result += String.fromCharCode(codeAsciiValue);
        }
        result += String(computerChoice);
    }
    else{
        for (let ch of passCode){
            codeAsciiValue = ch.charCodeAt(0) + 50;
            if (codeAsciiValue > 126){
                codeAsciiValue = (codeAsciiValue % 126) + 31;
            }
            result += String.fromCharCode(codeAsciiValue);
        }
        result += String(computerChoice);
    }
    return result;
}
function decrypt(passCodeRedrive){
    let resultDecrypt = "";
    let wordAsciiValue = 0;
    const choice = passCodeRedrive[passCodeRedrive.length - 1];

    if (choice === "1"){
        passCodeRedrive = passCodeRedrive.slice(0, -1);
        for (const ch of passCodeRedrive){
            wordAsciiValue = ch.charCodeAt(0) - 14;
            if (wordAsciiValue < 32){
                wordAsciiValue = (wordAsciiValue - 31) + 126;
            }
            resultDecrypt += String.fromCharCode(wordAsciiValue);
        }
    }
    else if (choice === "2"){
        passCodeRedrive = passCodeRedrive.slice(0, -1);
        for (const ch of passCodeRedrive){
            wordAsciiValue = ch.charCodeAt(0) - 28;
            if (wordAsciiValue < 32){
                wordAsciiValue = (wordAsciiValue - 31) + 126;
            }
            resultDecrypt += String.fromCharCode(wordAsciiValue);
        }
    }
    else{
        passCodeRedrive = passCodeRedrive.slice(0, -1);
        for (const ch of passCodeRedrive){
            wordAsciiValue = ch.charCodeAt(0) - 50;
            if (wordAsciiValue < 32){
                wordAsciiValue = (wordAsciiValue - 31) + 126;
            }
            resultDecrypt += String.fromCharCode(wordAsciiValue);
        }
    }
    return resultDecrypt;
}
function createSession(userMail){
    let session={user:userMail,createdTime:Date.now(),expiryTime:Date.now()+60*60*1000};
    localStorage.setItem("session",JSON.stringify(session));

}
function elementCreate(tag,className="",text="",idName=""){
    let result=document.createElement(tag);
    if (className){
        result.classList.add(className);
    }
    if (idName){
        result.setAttribute("id",idName);
    }
    result.textContent=text;
    return result;
}
function startValue(){
    if (!localStorage.getItem("passwords")){
        localStorage.setItem("passwords",JSON.stringify([]));
    }
    if (!localStorage.getItem("users")){
        localStorage.setItem("users",JSON.stringify([]));
    }
    if (!localStorage.getItem("trash")){
        localStorage.setItem("trash",JSON.stringify([]));
    }
    if (!sessionStorage.getItem("user")){
        sessionStorage.setItem("user","");
    }
}
function createAccount(){
    let usersDetail=JSON.parse(localStorage.getItem("users")) || [];
    let singleUser=[]
    createAccountWholePage.classList.remove("hide-page");
    if (!loginWholePage.classList.contains("hide-page")){
        loginWholePage.classList.add("hide-page");
    }

    let showOriginalPasswordButton=document.querySelector(".show-original-password");
    let showConfirmPasswordButton=document.querySelector(".show-confirm-password");
    let showOriginalPassword=false;
    let showConfirmPassword=false;
    let showOriginalIcon=showOriginalPasswordButton.lastChild;
    let showConfirmIcon=showConfirmPasswordButton.lastChild;
    let loginPageButton=document.querySelector(".login-new");
    let passwordOk=false;

    let emailInCreate=document.querySelector("#new-email");
    let emailErrorMessage=document.querySelector(".wrong-email-create");
    emailErrorMessage.textContent="";
    //let newPassword=document.querySelector("#new-password");
    let confirmPassword=document.querySelector("#new-confirm-password");
    let passwordConfirmErrorMessage=document.querySelector(".wrong-confirm-password-create");
    passwordConfirmErrorMessage.textContent="";
    let createAccountForm=document.querySelector(".create-account-form");
    let newPassword = document.querySelector("#create-new-password");

    let upperResult=document.querySelector(".upper-condition");
    let lowerResult=document.querySelector(".lower-condition");
    let specialResult=document.querySelector(".special-condition");
    let numberResult=document.querySelector(".number-condition");
    let spaceResult=document.querySelector(".no-spaces");
    let charcter12Result=document.querySelector(".charcter12-condition")

    function oneTime(){
        showOriginalPasswordButton.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showOriginalPassword){
                showOriginalPassword=false;
                showOriginalIcon.setAttribute("src","fortify-icons/eye-off.svg");
                newPassword.type="password";
            }
            else{
                showOriginalPassword=true;
                showOriginalIcon.setAttribute("src","fortify-icons/eye.svg");
                newPassword.type="text";
            }
        })
        showConfirmPasswordButton.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showConfirmPassword){
                showConfirmPassword=false;
                showConfirmIcon.setAttribute("src","fortify-icons/eye-off.svg");
                confirmPassword.type="password";
            }
            else{
                showConfirmPassword=true;
                showConfirmIcon.setAttribute("src","fortify-icons/eye.svg");
                confirmPassword.type="text";
            }
        })
        loginPageButton.addEventListener("click",()=>{
            login();
        })

        newPassword.addEventListener("input",()=>{
            if ((/[A-Z]/g).test(newPassword.value)){
                upperResult.textContent="✓    One upper-case";
                upperResult.classList.remove("condition-wrong");
                if (!upperResult.classList.contains("condition-correct")){
                    upperResult.classList.add("condition-correct");
                }
            }
            else{
                upperResult.textContent="✗    One upper-case";
                upperResult.classList.remove("condition-correct");
                if (!upperResult.classList.contains("condition-wrong")){
                    upperResult.classList.add("condition-wrong");
                }
            }
            if ((/[a-z]/g).test(newPassword.value)){
                lowerResult.textContent="✓    One lower-case";
                lowerResult.classList.remove("condition-wrong");
                if (!lowerResult.classList.contains("condition-correct")){
                    lowerResult.classList.add("condition-correct");
                }
            }
            else{
                lowerResult.textContent="✗    One lower-case";
                lowerResult.classList.remove("condition-correct");
                if (!lowerResult.classList.contains("condition-wrong")){
                    lowerResult.classList.add("condition-wrong");
                }
            }
            if ((/[^A-Za-z0-9\s]/g).test(newPassword.value)){
                specialResult.textContent="✓    One special-character";
                specialResult.classList.remove("condition-wrong");
                if (!specialResult.classList.contains("condition-correct")){
                    specialResult.classList.add("condition-correct");
                }
            }
            else{
                specialResult.textContent="✗    One special-character";
                specialResult.classList.remove("condition-correct");
                if (!specialResult.classList.contains("condition-wrong")){
                    specialResult.classList.add("condition-wrong");
                }
            }
            if ((/[0-9]/g).test(newPassword.value)){
                numberResult.textContent="✓    One number";
                numberResult.classList.remove("condition-wrong");
                if (!numberResult.classList.contains("condition-correct")){
                    numberResult.classList.add("condition-correct");
                }
            }
            else{
                numberResult.textContent="✗    One number";
                numberResult.classList.remove("condition-correct");
                if (!numberResult.classList.contains("condition-wrong")){
                    numberResult.classList.add("condition-wrong");
                }
            }
            if (!(/\s/g).test(newPassword.value) && newPassword.value){
                spaceResult.textContent="✓    No-spaces";
                spaceResult.classList.remove("condition-wrong");
                if (!spaceResult.classList.contains("condition-correct")){
                    spaceResult.classList.add("condition-correct");
                }
            }
            else{
                spaceResult.textContent="✗    No-spaces";
                spaceResult.classList.remove("condition-correct");
                if (!spaceResult.classList.contains("condition-wrong")){
                    spaceResult.classList.add("condition-wrong");
                }
            }
            if ((/.{12,}/g).test(newPassword.value)){
                charcter12Result.textContent="✓    Minimum 12 characters";
                charcter12Result.classList.remove("condition-wrong");
                if (!charcter12Result.classList.contains("condition-correct")){
                    charcter12Result.classList.add("condition-correct");
                }
            }
            else{
                charcter12Result.textContent="✗    Minimum 12 characters";
                charcter12Result.classList.remove("condition-correct");
                if (!charcter12Result.classList.contains("condition-wrong")){
                    charcter12Result.classList.add("condition-wrong");
                }
            }
            if ((/.{12,}/g).test(newPassword.value) && !(/\s/g).test(newPassword.value) && (/[0-9]/g).test(newPassword.value) && (/[^A-Za-z0-9\s]/g).test(newPassword.value) && (/[a-z]/g).test(newPassword.value) &&(/[A-Z]/g).test(newPassword.value)){
                passwordOk=true;
            }
            else{
                passwordOk=false;
            }
        })

        createAccountForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            singleUser=usersDetail.filter((element)=>element.email===emailInCreate.value);
            if (!/^[\w\.+]+@(?:gmail|zohomail|zohocorp)\.com$/g.test(emailInCreate.value)){
                emailErrorMessage.textContent="Invalid email";
            }
            else if (singleUser[0]){
                emailErrorMessage.textContent="This email is is already exist!"
            }
            else{
                emailErrorMessage.textContent="";
                if (passwordOk && newPassword.value!==confirmPassword.value){
                    passwordConfirmErrorMessage.textContent="Password isn't same, check the password"
                }
                else if (!passwordOk){
                    passwordConfirmErrorMessage.textContent="Password doesn't meet the conditions!";
                }
                else if (passwordOk && newPassword.value===confirmPassword.value){
                    passwordConfirmErrorMessage.textContent="";
                    let tempObj={};
                    tempObj.email=emailInCreate.value;
                    createSession(emailInCreate.value);
                    tempObj.password=encrypt(newPassword.value);
                    sessionStorage.setItem("user",emailInCreate.value);
                    emailInCreate.value="";
                    newPassword.value="";
                    confirmPassword.value="";
                    usersDetail.push(tempObj);
                    console.log(usersDetail);
                    localStorage.setItem("users",JSON.stringify(usersDetail));
                    window.location.href="passwordspace2.html";
                }
            }
        })
    }
    if (createOneTime){
        oneTime();
        createOneTime=false;
    }
}
function login(){
    let singleUser=[];
    let usersDetail=JSON.parse(localStorage.getItem("users")) || [];
    loginWholePage.classList.remove("hide-page")
    if (!createAccountWholePage.classList.contains("hide-page")){
        createAccountWholePage.classList.add("hide-page");
    }

    let showLoginPasswordButton=document.querySelector(".show-login-password");
    let showIconImage=showLoginPasswordButton.lastChild;
    let showLoginPassword=false;
    let signUpPageButton=document.querySelector(".create-new");

    let emailInputInLogin=document.querySelector("#email");
    let passwordInputInLogin=document.querySelector("#password");
    let loginForm=document.querySelector(".login-form")

    let incorrectEmailMessageInLogin=document.querySelector(".wrong-email");
    let incorrectPasswordMessageInLogin=document.querySelector(".wrong-password");

    function oneTime(){
        showLoginPasswordButton.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showLoginPassword){
                showLoginPassword=false;
                showIconImage.setAttribute("src","fortify-icons/eye-off.svg");
                passwordInputInLogin.type="password";
            }
            else{
                showLoginPassword=true;
                showIconImage.setAttribute("src","fortify-icons/eye.svg");
                passwordInputInLogin.type="text";
            }
        })

        signUpPageButton.addEventListener("click",()=>{
            createAccount();
        })

        loginForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            incorrectPasswordMessageInLogin.textContent="";
            singleUser=usersDetail.filter((element)=>element.email===emailInputInLogin.value);
            console.log(singleUser)
            if (!/^[\w\.+]+@(?:gmail|zohomail|zohocorp)\.com$/g.test(emailInputInLogin.value)){
                incorrectEmailMessageInLogin.textContent="Invalid email";
            }
            else if (!singleUser[0]){
                incorrectEmailMessageInLogin.textContent="Email is not exist create new account";
            }
            else{
                incorrectEmailMessageInLogin.textContent="";
                if (passwordInputInLogin.value===decrypt(singleUser[0].password)){
                    incorrectPasswordMessageInLogin.textContent="";
                    sessionStorage.setItem("user",emailInputInLogin.value);
                    createSession(emailInputInLogin.value);
                    window.location.href="passwordspace2.html";
                    emailInputInLogin.value="";
                    passwordInputInLogin.value="";
                }
                else{
                    incorrectPasswordMessageInLogin.textContent="Incorrect Password";
                }
            }
        })
    }
    if(loginOneTime){
        oneTime();
        loginOneTime=false;
    }
}

let loginWholePage=document.querySelector(".login-whole-page");
let loginPage=document.querySelector(".login");

let createAccountWholePage=document.querySelector(".create-account-whole-page");
let createAccountPage=document.querySelector(".create-account");

let loginOneTime=true;
let createOneTime=true;

if (!JSON.parse(localStorage.getItem("session")) || JSON.parse(localStorage.getItem("session")).expiryTime < Date.now()){
    startValue();
    login();
}
else{
    startValue();
    window.location.href="passwordspace2.html";
}


startValue(); //Intial value if the value is not in the local storage it work put empty array
 //All time the login page open first