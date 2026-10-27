function daysSince(dateValue) {
    let msPerDay = 24 * 60 * 60 * 1000;
    let diff = Date.now() - new Date(dateValue).getTime();
    return Math.floor(diff / msPerDay);
}
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function updateDetail(){
    userDetailPTag.textContent=sessionStorage.getItem("user")[0].toUpperCase();
    currentUserNameTag.textContent=sessionStorage.getItem("user");

    let allPasswordCountTag=document.querySelector(".all-password-count-value");
    let sharedWithMeCountTag=document.querySelector(".shared-with-me-password-count-value");
    let sharedByMeCountTag=document.querySelector(".shared-by-me-password-count-value");
    let favouriteCountTag=document.querySelector(".favourite-password-count-value");

    allPasswordCountTag.closest("section").onclick=function(){
        option1.click();
    }
    sharedByMeCountTag.closest("section").onclick=function(){
        option3.click();
    }
    sharedWithMeCountTag.closest("section").onclick=function(){
        option2.click();
    }
    favouriteCountTag.closest("section").onclick=function(){
        option4.click();
    }

    let passwordList=JSON.parse(localStorage.getItem("passwords")) || [];
    let userPasswordList=passwordList.filter((element)=>element.usermail===sessionStorage.getItem("user"));
    let sharedByMeList=userPasswordList.filter((element)=>element.sharedusers.length!==0).length;
    let sharedWithMeList=passwordList.filter((element)=>(element.sharedusers).includes(sessionStorage.getItem("user"))).length;
    let favouriteList=userPasswordList.filter((element)=>element.favourite).length;

    let strongCount=userPasswordList.filter((element)=>element.strength==="Strong").length;
    let goodCount=userPasswordList.filter((element)=>element.strength==="Good").length;
    let weakCount=userPasswordList.filter((element)=>element.strength==="Weak").length;

    allPasswordCountTag.textContent=userPasswordList.length;
    sharedWithMeCountTag.textContent=sharedWithMeList;
    sharedByMeCountTag.textContent=sharedByMeList;
    favouriteCountTag.textContent=favouriteList;

    let chart1 = document.getElementById("pie-chart1");
    if (chart1Password){
        chart1Password.data.datasets[0].data=[sharedByMeList,sharedWithMeList,favouriteList]
        chart1Password.options.plugins.legend.labels.color = document.querySelector("body").dataset.theme === "light" ? "black" : "white";
        chart1Password.update()
    }
    else{
        chart1Password=new Chart(chart1, {
            type: "pie",
            data: {
                labels: ["Shared by me", "Shared with me", "Favourites"],

                datasets: [{
                    data: [sharedByMeList,sharedWithMeList,favouriteList],

                    backgroundColor: [
                        "#0984E3",
                        "#00B894",
                        "#FDCB6E"
                    ],

                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        onClick : null,
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    let chart2 = document.getElementById("pie-chart2");

    if (chart2Password){
        chart1Password.data.datasets[0].data=[strongCount,goodCount,weakCount];
        chart2Password.options.plugins.legend.labels.color = document.querySelector("body").dataset.theme === "light" ? "black" : "white";
        chart2Password.update();
    }
    else{
        chart2Password=new Chart(chart2, {
            type: "pie",

            data: {
                labels: ["Strong","Good","Weak"],

                datasets: [{
                    data: [strongCount,goodCount,weakCount],

                    backgroundColor: [
                        "#9BDD73",
                        "#DFB65D",
                        "#F08A85"
                    ],
                    hoverBackgroundColor: ['#95de68ff', '#e1b24eff', '#ee756fff'],

                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        onClick : null,
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    let tableBodyInHistory=document.querySelector(".history-page-body-dashboard");
    let row=true;
    tableBodyInHistory.innerHTML="";
    let currentUser=sessionStorage.getItem("user");
    let historyDetail=JSON.parse(localStorage.getItem("history")) || {};
    let currentUseHistory=historyDetail[currentUser] || [];
    currentUseHistory=currentUseHistory.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    if (currentUseHistory.length==0){
        let tableRow=elementCreate("tr");
        if (row){
            row=false;
            tableRow.classList.add("first-row");
        }
        else{
            row=true;
            tableRow.classList.add("second-row");
        }
        tableBodyInHistory.append(tableRow);

        let actionDesc=elementCreate("td","","No result found");
        actionDesc.setAttribute("colspan","4")
        tableRow.append(actionDesc);

        let websiteDesc=elementCreate("td","");
        tableRow.append(websiteDesc);

        let messageDesc=elementCreate("td","");
        tableRow.append(messageDesc);

        let timeDesc=elementCreate("td","");
        tableRow.append(timeDesc);
    }
    else{
        for (let element of currentUseHistory.slice(0,7)){
            let tableRow=elementCreate("tr");
            if (row){
                row=false;
                tableRow.classList.add("first-row");
            }
            else{
                row=true;
                tableRow.classList.add("second-row");
            }
            tableBodyInHistory.append(tableRow);

            let actionDesc=elementCreate("td","",element.action);
            tableRow.append(actionDesc);

            let websiteDesc=elementCreate("td","",element.website);
            tableRow.append(websiteDesc);

            let messageDesc=elementCreate("td","",element.message);
            tableRow.append(messageDesc);

            let timeDesc=elementCreate("td","",new Date(element.time).toLocaleString(undefined, {dateStyle: 'medium',timeStyle: 'short',hour12: true}));
            tableRow.append(timeDesc);
        }
    }
}
function saveHistory(work,websiteName,message){
    let currentUser=sessionStorage.getItem("user");
    let historyDetail=JSON.parse(localStorage.getItem("history")) || {};
    let currentUseHistory=historyDetail[currentUser] || [];
    let tempObj={};
    tempObj.action=work;
    tempObj.website=websiteName;
    tempObj.message=message;
    tempObj.time=new Date().toISOString();
    currentUseHistory.unshift(tempObj);
    historyDetail[currentUser]=currentUseHistory;
    localStorage.setItem("history",JSON.stringify(historyDetail));
}
function popupMessage(message){
    let body=document.querySelector("body");
    
    let messageTag=elementCreate("p","popup-message",message);
    body.append(messageTag);
    setTimeout(()=>{
        messageTag.remove();
    },2000);
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
function deletePassword(websiteName){
    let confirmDelete=confirm("Confirm to delete");
    let currentUser=sessionStorage.getItem("user");
    let tempWebsiteDetail=(JSON.parse(localStorage.getItem("passwords")) || []);
    let trashDetail=JSON.parse(localStorage.getItem("trash"));
    if (confirmDelete){
        saveHistory("Moved to trash",websiteName,"Password moved to trash");
        popupMessage("Moved to trash");
        trashDetail.push(tempWebsiteDetail.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===websiteName)[0]);
        tempWebsiteDetail=tempWebsiteDetail.filter((element)=>!(element.usermail===sessionStorage.getItem("user") && element.website===websiteName));
        localStorage.setItem("passwords",JSON.stringify(tempWebsiteDetail));
        localStorage.setItem("trash",JSON.stringify(trashDetail));
    }
}   
function shareToAnotherOne(websiteName){
    let currentUser=sessionStorage.getItem("user");
    let shareToUserWholePage=document.querySelector(".share-password-whole-page");
    let shareToUserSection=document.querySelector(".share-password-section");
    let shareUserListSection=document.querySelector(".users-list-section");
    let saveUserButton=document.querySelector(".save-users");
    saveUserButton.classList.remove("hide-page");
    document.querySelector(".sharing-website-name").textContent=websiteName;

    shareToUserWholePage.classList.remove("hide-page");

    let closeSharePage=document.querySelector(".close-share-password");

    closeSharePage.onclick = function(){
        shareToUserWholePage.classList.add("hide-page");
    }
    
    let tempWebsiteDetail=(JSON.parse(localStorage.getItem("passwords")) || []).filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===websiteName)[0] || [];
    let websiteSharedUsers=tempWebsiteDetail.sharedusers || [];

    let tempUsersDeatil=JSON.parse(localStorage.getItem("users")) || [];
    let userNameList=[];
    for (let element of tempUsersDeatil){
        if (element.email!==currentUser){
            userNameList.push(element.email);
        }
    }
    shareUserListSection.innerHTML="";
    if (userNameList.length==0){
        let noResult=elementCreate("p","no-resul-in-share","No results found");
        shareUserListSection.append(noResult);
    }
    else{
        for (let element of userNameList){
            let userEmailLabel=elementCreate("label","user-name-label")
            userEmailLabel.setAttribute("for","for-"+element);

            let userEmailInput=elementCreate("input","user-name-input");
            userEmailInput.setAttribute("type","checkbox");
            userEmailInput.setAttribute("id","for-"+element);
            userEmailInput.setAttribute("data-usermailid",element);

            if (websiteSharedUsers.includes(element)){
                userEmailInput.checked=true;
            }
            userEmailLabel.append(userEmailInput,element);
            shareUserListSection.append(userEmailLabel);
        }
    }
    let usersInputs=document.querySelectorAll(".user-name-input");
    saveUserButton.onclick = function(){
        let finalList=[];
        [...usersInputs].forEach((element)=>{
            if (element.checked){
                finalList.push(element.dataset.usermailid);
            }
        })
        let tempPasswordListForChange=JSON.parse(localStorage.getItem("passwords")) || [];
        for (let element of tempPasswordListForChange){
            if (element.usermail===currentUser && element.website===websiteName){
                element.sharedusers=finalList;
            }
        }
        localStorage.setItem("passwords",JSON.stringify(tempPasswordListForChange));
        shareToUserWholePage.classList.add("hide-page");
    }
}
function sharedUsers(websiteName){
    let currentUser=sessionStorage.getItem("user");
    let shareToUserWholePage=document.querySelector(".share-password-whole-page");
    let shareToUserSection=document.querySelector(".share-password-section");
    let shareUserListSection=document.querySelector(".users-list-section");
    let saveUserButton=document.querySelector(".save-users");
    if (!saveUserButton.classList.contains("hide-page")){
        saveUserButton.classList.add("hide-page");
    }
    document.querySelector(".sharing-website-name").textContent=websiteName;

    shareToUserWholePage.classList.remove("hide-page");

    let closeSharePage=document.querySelector(".close-share-password");

    closeSharePage.onclick = function(){
        shareToUserWholePage.classList.add("hide-page");
    }
    
    let tempWebsiteDetail=(JSON.parse(localStorage.getItem("passwords")) || []).filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===websiteName)[0] || [];
    let websiteSharedUsers=tempWebsiteDetail.sharedusers || [];

    let tempUsersDeatil=JSON.parse(localStorage.getItem("users")) || [];
    let userNameList=[];
    for (let element of tempUsersDeatil){
        if (element.email!==currentUser){
            userNameList.push(element.email);
        }
    }
    shareUserListSection.innerHTML="";
    if (userNameList.length==0){
        let noResult=elementCreate("p","no-resul-in-share","No results found");
        shareUserListSection.append(noResult);
    }
    else{
        for (let element of userNameList){

            if (websiteSharedUsers.includes(element)){
                let userEmailLabel=elementCreate("label","user-name-label")
                userEmailLabel.setAttribute("for","for-"+element);

                let userEmailInput=elementCreate("input","user-name-input");
                userEmailInput.setAttribute("type","checkbox");
                userEmailInput.disabled=true;
                userEmailInput.setAttribute("id","for-"+element);
                userEmailInput.setAttribute("data-usermailid",element);
                userEmailInput.checked=true;
                userEmailLabel.append(userEmailInput,element);
                shareUserListSection.append(userEmailLabel);
            }
        }
    }
}
function showSinglePassword(websiteName,sharedByUserName=""){
    let firsTimeOpen=true;
    let showNewPasswordSituvation=false;
    let passwordList=JSON.parse(localStorage.getItem("passwords")) || [];
    let goingToShowPassword={};
    if (sharedByUserName){
        goingToShowPassword=passwordList.filter((element)=>element.usermail===sharedByUserName && element.website===websiteName)[0];
    }
    else{
        goingToShowPassword=passwordList.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===websiteName)[0];
    }
    let showSinglePasswordWholePage=document.querySelector(".show-password-whole-page");
    showSinglePasswordWholePage.classList.remove("hide-page");

    let closeShowSinglePassword=document.querySelector(".close-show-password-page");
    let websiteFirstLetter=document.querySelector(".show-website-first-letter");
    let websiteNameInTitle=document.querySelector(".show-website-name");

    let displayWebsite=document.querySelector(".show-website-name-input");
    let displayUsername=document.querySelector(".show-username");
    let displayPassword=document.querySelector(".show-password");
    let displayStrength=document.querySelector(".password-strength-show-password");

    displayWebsite.value=goingToShowPassword.website;
    websiteNameInTitle.textContent=goingToShowPassword.website;
    websiteFirstLetter.textContent=goingToShowPassword.website[0].toUpperCase();
    displayUsername.value=goingToShowPassword.username;
    displayPassword.value=decrypt(goingToShowPassword.password);
    displayStrength.textContent=goingToShowPassword.strength;

    let favouritePassword=document.querySelector(".show-password-favourite");
    let editIcon=document.querySelector(".show-password-edit");

    if (goingToShowPassword.favourite){
        favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
    }
    else{
        favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
    }

    favouritePassword.onclick = function (){
        let passwordListToFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
        let favouritePasswordList=passwordListToFavourite.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===goingToShowPassword.website)[0];
        if (favouritePasswordList.favourite){
            let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
            toChangeFavourite.map((element)=>{
                if (element.usermail===sessionStorage.getItem("user") && element.website===goingToShowPassword.website){
                    element.favourite=false
                }
            })
            saveHistory("Removed favourite",goingToShowPassword.website,"The website removed from favourite list");
            popupMessage("Remove from favourites");
            localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
            favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
        }
        else{
            let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
            toChangeFavourite.map((element)=>{
                if (element.usermail===sessionStorage.getItem("user") && element.website===goingToShowPassword.website){
                    element.favourite=true
                }
            })
            saveHistory("Added favourite",goingToShowPassword.website,"The website Added in favourite list");
            popupMessage("Added to favourites");
            localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
            favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
        }
        pushPasswordsInPage();
        updateDetail();
    };
    favouritePassword.classList.remove("hide-page");
    editIcon.classList.remove("hide-page");
    if (sharedByUserName){
        if (!favouritePassword.classList.contains("hide-page")){
            favouritePassword.classList.add("hide-page");
        }
        if (!editIcon.classList.contains("hide-page")){
            editIcon.classList.add("hide-page");
        }
    }

    let range1=document.querySelector(".strength-range1");
    let range2=document.querySelector(".strength-range2");
    let range3=document.querySelector(".strength-range3");
    let allRanges=document.querySelector(".strength-ranges");

    [...allRanges.children].forEach((element)=>{
        element.classList.remove("good-password");
        element.classList.remove("weak-password");
        element.classList.remove("strong-password");
    })

    if (goingToShowPassword.strength=="Weak"){
        range1.classList.add("weak-password");
    }
    else if (goingToShowPassword.strength=="Good"){
        range1.classList.add("good-password");
        range2.classList.add("good-password");
    }
    else{
        [...allRanges.children].forEach((element)=>{
            element.classList.add("strong-password");
        })
    }

    let copyWebsiteName=document.querySelector(".copy-show-website-name");
    let copyUsername=document.querySelector(".copy-show-username");
    let copyPassword=document.querySelector(".copy-show-password");
    let showHiddenPassword=document.querySelector(".show-show-password");
    showHiddenPassword.setAttribute("src","fortify-icons/eye-off.svg");

    closeShowSinglePassword.onclick = function(){
        showSinglePasswordWholePage.classList.add("hide-page");
    }
    editIcon.onclick=function(){
        document.querySelector(".edit-password-whole-page").classList.remove("hide-page");
        closeShowSinglePassword.click();
        editPasswordPage(goingToShowPassword.website);
    }
    copyWebsiteName.onclick = async function  () {
        try{
            await navigator.clipboard.writeText(goingToShowPassword.website);
            popupMessage("Website Copied");
        }
        catch(e){
            console.log(e)
        }
    };
    copyUsername.onclick = async function () {
        try{
            await navigator.clipboard.writeText(goingToShowPassword.username);
            popupMessage("Username Copied");
        }
        catch(e){
            console.log(e)
        }
    };
    copyPassword.onclick = async function(){
        try{
            await navigator.clipboard.writeText(decrypt(goingToShowPassword.password));
            popupMessage("Password Copied");
        }
        catch(e){
            console.log(e)
        }
    };
    showHiddenPassword.onclick=function(){
        if(showNewPasswordSituvation){
            showNewPasswordSituvation=false;
            showHiddenPassword.setAttribute("src","fortify-icons/eye-off.svg");
            displayPassword.type="password";
        }
        else{
            showNewPasswordSituvation=true;
            showHiddenPassword.setAttribute("src","fortify-icons/eye.svg");
            displayPassword.type="text";
            if (firsTimeOpen){
                firsTimeOpen=false;
                saveHistory("Password viewed",goingToShowPassword.website,"	The website Password viewed")
            }
        }
    }
}
function passwordValidation(password){
    let upper=false,lower=false,special=false,number=false,nospace=false,moreThan8Character=false;
    if ((/[A-Z]/g).test(password)){
        upper=true;
    }
    if ((/[a-z]/g).test(password)){
        lower=true;
    }
    if ((/[^A-Za-z0-9\s]/g).test(password)){
        special=true;
    }
    if ((/[0-9]/g).test(password)){
        number=true;
    }
    if (!(/\s/g).test(password) && password){
        nospace=true;
    }
    if ((/.{12,}/g).test(password)){
        moreThan8Character=true;
    }
    return [upper,lower,special,number,nospace,moreThan8Character];
}
function pushPasswordsInPage(){
    let row=true;
    let passwordList=JSON.parse(localStorage.getItem("passwords")) || [];
    let userPasswordList=passwordList.filter((element)=>element.usermail===sessionStorage.getItem("user"));
    let tempUserPasswordList=userPasswordList;
    userPasswordList=userPasswordList.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()) || (element.username.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    let usersPasswordPageInAllPassword=document.querySelector(".users-all-password");
    usersPasswordPageInAllPassword.innerHTML="";
    if (userPasswordList.length===0 || passwordList.length===0){
        let empty=elementCreate("p","no-result","No result found");
        usersPasswordPageInAllPassword.append(empty);
    }
    else{
        for (let password of userPasswordList){
            let singlePassword=elementCreate("section","single-password");
            usersPasswordPageInAllPassword.append(singlePassword);
            singlePassword.setAttribute("title","Click to view password");

            singlePassword.addEventListener("click",()=>{
                saveHistory("Password accessed",password.website,"The website Password accessed");
                showSinglePassword(password.website);
            })

            let passwordDetailSection=elementCreate("section","single-password-detail-section");
            singlePassword.append(passwordDetailSection);

            let websiteFirstLetter=elementCreate("p","website-first-letter",(password.website)[0].toUpperCase());
            passwordDetailSection.append(websiteFirstLetter);

            let passwordWebsiteName=elementCreate("p","password-website-name",password.website);
            passwordDetailSection.append(passwordWebsiteName);

            let websiteNameDetailSection=elementCreate("section","website-name-detail-section");
            singlePassword.append(websiteNameDetailSection);

            let passwordUserName=elementCreate("p","password-user-name",password.username);
            websiteNameDetailSection.append(passwordUserName);

            let passwordIconSection=elementCreate("section","password-extra-detail");
            singlePassword.append(passwordIconSection);

            let daysDetail=elementCreate("p","password-last-update-day",daysSince(password.createdtime)+" days ago ")
            websiteNameDetailSection.append(daysDetail);

            let shareIcon=elementCreate("img","share-icon");
            shareIcon.setAttribute("src","fortify-icons/share.svg");
            shareIcon.setAttribute("title","Share");
            passwordIconSection.append(shareIcon);

            shareIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                shareToAnotherOne(passwordWebsiteName.textContent);
            })

            let copyIcon=elementCreate("img","copy-icon");
            copyIcon.setAttribute("src","fortify-icons/copy.svg");
            copyIcon.setAttribute("title","copy");
            passwordIconSection.append(copyIcon);

            copyIcon.addEventListener("click", async (e) => {
                e.stopPropagation();
                try{
                    await navigator.clipboard.writeText(decrypt(password.password));
                    popupMessage("Password Copied");
                }
                catch(e){
                    console.log(e);
                }
            });

            let favouritePassword=elementCreate("img","favourite-password-icon");
            passwordIconSection.append(favouritePassword);
            favouritePassword.setAttribute("title","Favourite icon");

            if (password.favourite){
                favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
            }
            else{
                favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
            }

            favouritePassword.addEventListener("click",(e)=>{
                e.stopPropagation();
                let passwordListToFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                let favouritePasswordList=passwordListToFavourite.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent)[0];
                if (favouritePasswordList.favourite){
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=false
                        }
                    })
                    saveHistory("Removed favourite",passwordWebsiteName.textContent,"The website removed from favourite list");
                    popupMessage("Removed from favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
                }
                else{
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=true
                        }
                    })
                    saveHistory("Added favourite",passwordWebsiteName.textContent,"The website Added in favourite list");
                    popupMessage("Added to favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
                }
                pushPasswordsInPage();
                updateDetail();
            });

            let editIcon=elementCreate("img","edit-icon");
            editIcon.setAttribute("src","fortify-icons/edit-icon.svg");
            editIcon.setAttribute("title","Edit");
            passwordIconSection.append(editIcon);

            editIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                editPasswordPage(password.website);
                document.querySelector(".edit-password-whole-page").classList.remove("hide-page");
            })

            let deleteIcon=elementCreate("img","delete-icon");
            deleteIcon.setAttribute("src","fortify-icons/delete-icon.svg");
            deleteIcon.setAttribute("title","Delete");
            passwordIconSection.append(deleteIcon);

            deleteIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                deletePassword(password.website);
                pushPasswordsInPage();
            })

        }
    }

    let sharedByMeList=tempUserPasswordList.filter((element)=>element.sharedusers.length!==0);
    sharedByMeList=sharedByMeList.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()) || (element.username.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    let sharedByMepasswordSection=document.querySelector(".shared-by-me-passwords-section");
    sharedByMepasswordSection.innerHTML="";
    if (sharedByMeList.length===0){
        let empty1=elementCreate("p","no-result");
        sharedByMepasswordSection.append(empty1);
        let empty=elementCreate("p","no-result","No result found");
        sharedByMepasswordSection.append(empty);
    }
    else{
        for (let password of sharedByMeList){
            let singlePassword=elementCreate("section","single-password");
            sharedByMepasswordSection.append(singlePassword);
            singlePassword.setAttribute("title","Click to view password");

            singlePassword.addEventListener("click",()=>{
                saveHistory("Password accessed",password.website,"The website Password accessed");
                showSinglePassword(password.website);
            })

            let passwordDetailSection=elementCreate("section","single-password-detail-section");
            singlePassword.append(passwordDetailSection);

            let websiteFirstLetter=elementCreate("p","website-first-letter",(password.website)[0].toUpperCase());
            passwordDetailSection.append(websiteFirstLetter);

            let passwordWebsiteName=elementCreate("p","password-website-name",password.website);
            passwordDetailSection.append(passwordWebsiteName);

            let websiteNameDetailSection=elementCreate("section","website-name-detail-section");
            singlePassword.append(websiteNameDetailSection);

            let passwordUserName=elementCreate("p","password-user-name",password.username);
            websiteNameDetailSection.append(passwordUserName);

            let passwordIconSection=elementCreate("section","password-extra-detail");
            singlePassword.append(passwordIconSection);

            let daysDetail=elementCreate("p","password-last-update-day",daysSince(password.createdtime)+" days ago ")
            websiteNameDetailSection.append(daysDetail);

            let shareIcon=elementCreate("img","share-icon");
            shareIcon.setAttribute("src","fortify-icons/share.svg");
            shareIcon.setAttribute("title","Share");
            passwordIconSection.append(shareIcon);

            shareIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                sharedUsers(passwordWebsiteName.textContent);
            })

            let copyIcon=elementCreate("img","copy-icon");
            copyIcon.setAttribute("src","fortify-icons/copy.svg");
            copyIcon.setAttribute("title","copy");
            passwordIconSection.append(copyIcon);

            copyIcon.addEventListener("click", async (e) => {
                e.stopPropagation();
                try{
                    await navigator.clipboard.writeText(decrypt(password.password));
                    popupMessage("Password Copied");
                }
                catch(e){
                    console.log(e);
                }
            });

            let favouritePassword=elementCreate("img","favourite-password-icon");
            passwordIconSection.append(favouritePassword);
            favouritePassword.setAttribute("title","Favourite icon");

            let editIcon=elementCreate("img","edit-icon");
            editIcon.setAttribute("src","fortify-icons/edit-icon.svg");
            editIcon.setAttribute("title","Edit");
            passwordIconSection.append(editIcon);

            editIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                editPasswordPage(password.website);
                document.querySelector(".edit-password-whole-page").classList.remove("hide-page");
            })

            if (password.favourite){
                favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
            }
            else{
                favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
            }

            favouritePassword.addEventListener("click",(e)=>{
                e.stopPropagation();
                let passwordListToFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                let favouritePasswordList=passwordListToFavourite.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent)[0];
                if (favouritePasswordList.favourite){
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=false
                        }
                    })
                    saveHistory("Removed favourite",passwordWebsiteName.textContent,"The website removed from favourite list");
                    popupMessage("Removed from favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
                }
                else{
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=true
                        }
                    })
                    saveHistory("Added favourite",passwordWebsiteName.textContent,"The website Added in favourite list");
                    popupMessage("Added to favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
                }
                pushPasswordsInPage();
                updateDetail();
            });

        }
    }

    let sharedWithMeList=passwordList.filter((element)=>(element.sharedusers).includes(sessionStorage.getItem("user")));
    sharedWithMeList=sharedWithMeList.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()) || (element.username.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    let sharedWithMepasswordSection=document.querySelector(".shared-with-me-passwords-section");
    sharedWithMepasswordSection.innerHTML="";
    if (sharedWithMeList.length===0){
        let empty1=elementCreate("p","no-result");
        sharedWithMepasswordSection.append(empty1);
        let empty=elementCreate("p","no-result","No result found");
        sharedWithMepasswordSection.append(empty);
    }
    else{
        for (let password of sharedWithMeList){
            let singlePassword=elementCreate("section","single-password");
            sharedWithMepasswordSection.append(singlePassword);
            singlePassword.setAttribute("title","Click to view password");

            singlePassword.addEventListener("click",()=>{
                saveHistory("Password accessed",password.website,"The website Password accessed");
                showSinglePassword(password.website,password.usermail);
            })

            let passwordDetailSection=elementCreate("section","single-password-detail-section");
            singlePassword.append(passwordDetailSection);

            let websiteFirstLetter=elementCreate("p","website-first-letter",(password.website)[0].toUpperCase());
            passwordDetailSection.append(websiteFirstLetter);

            let passwordWebsiteName=elementCreate("p","password-website-name",password.website);
            passwordDetailSection.append(passwordWebsiteName);

            let websiteNameDetailSection=elementCreate("section","website-name-detail-section");
            singlePassword.append(websiteNameDetailSection);

            let passwordIconSection=elementCreate("section","password-extra-detail");
            passwordIconSection.classList.add("extra-detail-shared-withme");
            singlePassword.append(passwordIconSection);

            let copyIcon=elementCreate("img","copy-icon");
            copyIcon.setAttribute("src","fortify-icons/copy.svg");
            copyIcon.setAttribute("title","copy");
            passwordIconSection.append(copyIcon);

            copyIcon.addEventListener("click", async (e) => {
                e.stopPropagation();
                try{
                    await navigator.clipboard.writeText(decrypt(password.password));
                    popupMessage("Password Copied");
                }
                catch(e){
                    console.log(e);
                }
            });

            let passwordSharedUserName=elementCreate("p","password-user-name","Shared by : "+password.usermail);
            websiteNameDetailSection.append(passwordSharedUserName);


        }
    }

    let favouriteList=tempUserPasswordList.filter((element)=>element.favourite);
    favouriteList=favouriteList.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()) || (element.username.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    let favouritePasswordsSection=document.querySelector(".favourite-password-section");
    favouritePasswordsSection.innerHTML="";
    if (favouriteList.length===0){
        let empty1=elementCreate("p","no-result");
        favouritePasswordsSection.append(empty1);

        let empty=elementCreate("p","no-result","No result found");
        favouritePasswordsSection.append(empty);
    }
    else{
        for (let password of favouriteList){
            let singlePassword=elementCreate("section","single-password");
            favouritePasswordsSection.append(singlePassword);
            singlePassword.setAttribute("title","Click to view password");

            singlePassword.addEventListener("click",()=>{
                saveHistory("Password accessed",password.website,"The website Password accessed");
                showSinglePassword(password.website);
            })

            let passwordDetailSection=elementCreate("section","single-password-detail-section");
            singlePassword.append(passwordDetailSection);

            let websiteFirstLetter=elementCreate("p","website-first-letter",(password.website)[0].toUpperCase());
            passwordDetailSection.append(websiteFirstLetter);

            let passwordWebsiteName=elementCreate("p","password-website-name",password.website);
            passwordDetailSection.append(passwordWebsiteName);

            let websiteNameDetailSection=elementCreate("section","website-name-detail-section");
            singlePassword.append(websiteNameDetailSection);

            let passwordUserName=elementCreate("p","password-user-name",password.username);
            websiteNameDetailSection.append(passwordUserName);

            let passwordIconSection=elementCreate("section","password-extra-detail");
            singlePassword.append(passwordIconSection);

            let daysDetail=elementCreate("p","password-last-update-day",daysSince(password.createdtime)+" days ago ")
            websiteNameDetailSection.append(daysDetail);

            let shareIcon=elementCreate("img","share-icon");
            shareIcon.setAttribute("src","fortify-icons/share.svg");
            shareIcon.setAttribute("title","Share");
            passwordIconSection.append(shareIcon);

            shareIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                shareToAnotherOne(passwordWebsiteName.textContent);
            })

            let copyIcon=elementCreate("img","copy-icon");
            copyIcon.setAttribute("src","fortify-icons/copy.svg");
            copyIcon.setAttribute("title","copy");
            passwordIconSection.append(copyIcon);

            copyIcon.addEventListener("click", async (e) => {
                e.stopPropagation();
                try{
                    await navigator.clipboard.writeText(decrypt(password.password));
                    popupMessage("Password Copied");
                }
                catch(e){
                    console.log(e);
                }
            });

            let favouritePassword=elementCreate("img","favourite-password-icon");
            passwordIconSection.append(favouritePassword);
            favouritePassword.setAttribute("title","Favourite icon");

            if (password.favourite){
                favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
            }
            else{
                favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
            }

            favouritePassword.addEventListener("click",(e)=>{
                e.stopPropagation();
                let passwordListToFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                let favouritePasswordList=passwordListToFavourite.filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent)[0];
                if (favouritePasswordList.favourite){
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=false
                        }
                    })
                    saveHistory("Removed favourite",passwordWebsiteName.textContent,"The website removed from favourite list");
                    popupMessage("Removed from favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-outline.svg");
                }
                else{
                    let toChangeFavourite=JSON.parse(localStorage.getItem("passwords")) || [];
                    toChangeFavourite.map((element)=>{
                        if (element.usermail===sessionStorage.getItem("user") && element.website===passwordWebsiteName.textContent){
                            element.favourite=true
                        }
                    })
                    saveHistory("Added favourite",passwordWebsiteName.textContent,"The website Added in favourite list");
                    popupMessage("Added to favourites");
                    localStorage.setItem("passwords",JSON.stringify(toChangeFavourite));
                    favouritePassword.setAttribute("src","fortify-icons/star-gold-filled.svg");
                }
                pushPasswordsInPage();
                updateDetail();
            });

            let editIcon=elementCreate("img","edit-icon");
            editIcon.setAttribute("src","fortify-icons/edit-icon.svg");
            editIcon.setAttribute("title","Edit");
            passwordIconSection.append(editIcon);

            editIcon.addEventListener("click",(e)=>{
                e.stopPropagation();
                editPasswordPage(password.website);
                document.querySelector(".edit-password-whole-page").classList.remove("hide-page");
            })

        }
    }

    let tableBodyInHistory=document.querySelector(".history-page-body");
    tableBodyInHistory.innerHTML="";
    let currentUser=sessionStorage.getItem("user");
    let historyDetail=JSON.parse(localStorage.getItem("history")) || {};
    let currentUseHistory=historyDetail[currentUser] || [];
    currentUseHistory=currentUseHistory.filter((element)=>(element.website.toLowerCase()).includes(searchPassword.value.toLowerCase()));
    if (currentUseHistory.length==0){
        let tableRow=elementCreate("tr");
        if (row){
            row=false;
            tableRow.classList.add("first-row");
        }
        else{
            row=true;
            tableRow.classList.add("second-row");
        }
        tableBodyInHistory.append(tableRow);

        let actionDesc=elementCreate("td","","No result found");
        actionDesc.setAttribute("colspan","4")
        tableRow.append(actionDesc);

        let websiteDesc=elementCreate("td","");
        tableRow.append(websiteDesc);

        let messageDesc=elementCreate("td","");
        tableRow.append(messageDesc);

        let timeDesc=elementCreate("td","");
        tableRow.append(timeDesc);
    }
    else{
        for (let element of currentUseHistory){
            let tableRow=elementCreate("tr");
            if (row){
                row=false;
                tableRow.classList.add("first-row");
            }
            else{
                row=true;
                tableRow.classList.add("second-row");
            }
            tableBodyInHistory.append(tableRow);

            let actionDesc=elementCreate("td","",element.action);
            tableRow.append(actionDesc);

            let websiteDesc=elementCreate("td","",element.website);
            tableRow.append(websiteDesc);

            let messageDesc=elementCreate("td","",element.message);
            tableRow.append(messageDesc);

            let timeDesc=elementCreate("td","",new Date(element.time).toLocaleString(undefined, {dateStyle: 'medium',timeStyle: 'short',hour12: true}));
            tableRow.append(timeDesc);
        }
    }

    let trashPage=document.querySelector(".trash-section");
    trashPage.innerHTML="";
    let trashList=JSON.parse(localStorage.getItem("trash")).filter((element)=>element.usermail===currentUser) || [] ;
    if (trashList.length===0){
        let empty1=elementCreate("p","no-result","");
        trashPage.append(empty1);

        let empty2=elementCreate("p","no-result","No result found");
        trashPage.append(empty2);
    }
    else{
        for (let password of trashList){
            let singlePassword=elementCreate("section","single-password");
            trashPage.append(singlePassword);
            singlePassword.setAttribute("title","Click to view password");

            let passwordDetailSection=elementCreate("section","single-password-detail-section");
            singlePassword.append(passwordDetailSection);

            let websiteFirstLetter=elementCreate("p","website-first-letter",(password.website)[0].toUpperCase());
            passwordDetailSection.append(websiteFirstLetter);

            let passwordWebsiteName=elementCreate("p","password-website-name",password.website);
            passwordDetailSection.append(passwordWebsiteName);

            let websiteNameDetailSection=elementCreate("section","website-name-detail-section");
            singlePassword.append(websiteNameDetailSection);

            let passwordUserName=elementCreate("p","password-user-name",password.username);
            websiteNameDetailSection.append(passwordUserName);

            let passwordIconSection=elementCreate("section","password-extra-detail");
            singlePassword.append(passwordIconSection);

            let daysDetail=elementCreate("p","password-last-update-day",daysSince(password.createdtime)+" days ago ")
            websiteNameDetailSection.append(daysDetail);

            let restoreIcon=elementCreate("img","restore-icon");
            restoreIcon.setAttribute("src","fortify-icons/restore-icon-3.svg");
            restoreIcon.setAttribute("title","Restore");
            passwordIconSection.append(restoreIcon);

            restoreIcon.addEventListener("click",()=>{
                let tempTrashList=JSON.parse(localStorage.getItem("trash")) || [] ;
                let tempPasswordList=JSON.parse(localStorage.getItem("passwords")) || [];
                tempPasswordList.push(tempTrashList.filter((element)=>(element.usermail===sessionStorage.getItem("user") && element.website===password.website))[0]);
                localStorage.setItem("passwords",JSON.stringify(tempPasswordList));
                tempTrashList=tempTrashList.filter((element)=>!(element.usermail===sessionStorage.getItem("user") && element.website===password.website));
                localStorage.setItem("trash",JSON.stringify(tempTrashList));
                saveHistory("Password restored",password.website,"Password restored from trash");
                popupMessage("Password restored");
                pushPasswordsInPage();
                updateDetail();
            })

            let deleteIcon=elementCreate("img","delete-icon");
            deleteIcon.setAttribute("src","fortify-icons/delete-icon.svg");
            deleteIcon.setAttribute("title","Delete");
            passwordIconSection.append(deleteIcon);

            deleteIcon.addEventListener("click",()=>{
                let confirmDelete=confirm("Confirm to delete the password permanently");
                if (confirmDelete){
                    let tempTrashList=JSON.parse(localStorage.getItem("trash")) || [] ;
                    tempTrashList=tempTrashList.filter((element)=>!(element.usermail===sessionStorage.getItem("user") && element.website===password.website));
                    localStorage.setItem("trash",JSON.stringify(tempTrashList));
                    saveHistory("Deleted permanently",password.website,"Password deleted permanently");
                    popupMessage("Deleted permanently");
                }
                pushPasswordsInPage();
            })

        }
    }
}
function passwordGenerator(){
    let closeGenerator=document.querySelector(".close-generator");

    let generatePasswordButton=document.querySelector(".re-generate");

    let generatedInput=document.querySelector(".generator-input");

    let wantUpper=document.querySelector(".want-upper");
    let wantLower=document.querySelector(".want-lower");
    let wantSpecial=document.querySelector(".want-special");
    let wantNumber=document.querySelector(".want-number");

    let whichType=document.querySelectorAll(".which-type");

    let charLengthInput=document.querySelector(".char-length");
    let charLengthValue=document.querySelector(".char-length-value");

    let copyPasswordButton=document.querySelector(".copy-password");

    let passwordStrength=document.querySelector(".password-strength-in-generator");

    function createPassword(){
        let newPassword="";
        let runTime=1;
        while (runTime<=Number(charLengthInput.value)){
            let temp=String.fromCharCode(randomBetween(33,126));
            if ((temp >= "A" && temp <= "Z") && wantUpper.checked){
                newPassword+=temp;
                runTime++;
            }
            else if ((temp >= "a" && temp <= "z") && wantLower.checked){
                newPassword+=temp;
                runTime++;
            }
            else if ((temp >= "0" && temp <= "9") && wantNumber.checked){
                newPassword+=temp;
                runTime++;
            }
            else if (!(temp >= "A" && temp <= "Z") && !(temp >= "a" && temp <= "z") && !(temp >= "0" && temp <= "9") && wantSpecial.checked){
                newPassword+=temp;
                runTime++
            }
        }
        generatedInput.value=newPassword;

        let passwordPower=passwordValidation(newPassword);
        passwordStrength.classList.remove("strong");
        passwordStrength.classList.remove("weak");
        passwordStrength.classList.remove("good");
        if (passwordPower.every((element)=>element)){
            passwordStrength.textContent="Strong password";
            passwordStrength.classList.add("strong");
        }
        else if (passwordPower.filter((element)=>element).length>=4 && passwordPower[4]){
            passwordStrength.textContent="Good password";
            passwordStrength.classList.add("good");
        }
        else if (passwordPower.filter((element)=>element).length>2 && passwordPower[4] && newPassword.length>=4){
            passwordStrength.textContent="Weak password";
            passwordStrength.classList.add("weak");
        }
        else{
            passwordStrength.textContent="Weak password";
            passwordStrength.classList.add("weak");
        }
    }
    createPassword();
    function oneTimeGenerate(){
        closeGenerator.addEventListener("click",()=>{
            document.querySelector(".password-generator-page").classList.add("hide-page");
        })
        charLengthInput.addEventListener("input",()=>{
            charLengthValue.textContent=charLengthInput.value;
            createPassword();
        })

        copyPasswordButton.addEventListener("click", async () => {
            try{
                await navigator.clipboard.writeText(generatedInput.value);
                popupMessage("Password Copied");
            }
            catch(e){
                console.log(e);
            }
        });
        [...whichType].map((element)=>{
            element.addEventListener("input",()=>{
                if ([...whichType].filter((element1)=>element1.checked).length===0){
                    element.checked=true;
                }
                createPassword();
            })
        })

        generatePasswordButton.addEventListener("click",()=>{
            generatedInput.classList.add("indicate-outline");
            setTimeout(()=>{
                generatedInput.classList.remove("indicate-outline");
            },300);
            createPassword();
        })
    }
    if (oneTimeGenerateSituvation){
        oneTimeGenerateSituvation=false;
        oneTimeGenerate();
    }
}
function passwordValidationPage(){
    let closeValidator=document.querySelector(".close-validator");
    let passwordStrengthValueShow=document.querySelector(".password-strength")
    let passwordInputInValidator=document.querySelector(".password-for-validator");
    let showValidatorPassword=document.querySelector(".show-password-in-validator");
    let showValidatorPasswordIcon=showValidatorPassword.firstChild;
    let showValidatorPasswordSituvation=false;
    let allRanges=document.querySelector(".score-in-range-section");
    let range1=document.querySelector(".range1");
    let range2=document.querySelector(".range2");
    let range3=document.querySelector(".range3");
    let range4=document.querySelector(".range4");
    let upperWord=document.querySelector(".upper-case-type");
    let lowerWord=document.querySelector(".lower-case-type");
    let specialWord=document.querySelector(".special-type");
    let numberWord=document.querySelector(".number-type");
    let nospaceWord=document.querySelector(".no-spaces-type");
    let morethan12Word=document.querySelector(".charcter12-condition-type");
    function onetimeRunInValidator(){
        closeValidator.addEventListener("click",()=>{
            document.querySelector(".password-validator-page").classList.add("hide-page");
        })
        passwordInputInValidator.addEventListener("input",()=>{
            let passwordPower=passwordValidation(passwordInputInValidator.value);
            [...allRanges.children].forEach((element)=>{
                element.classList.remove("weak-password");
                element.classList.remove("good-password");
                element.classList.remove("strong-password");
            })
            if (passwordPower.every((element)=>!element)){
                passwordStrengthValueShow.textContent="Waiting for password"
            }
            else if (passwordPower.every((element)=>element)){
                [...allRanges.children].forEach((element)=>{
                    element.classList.add("strong-password");
                })
                passwordStrengthValueShow.textContent="Strong password"
            }
            else if (passwordPower.filter((element)=>element).length>=4 && passwordPower[4]){
                range1.classList.add("good-password");
                range2.classList.add("good-password");
                range3.classList.add("good-password");
                passwordStrengthValueShow.textContent="Good password"
            }
            else if (passwordPower.filter((element)=>element).length>2 && passwordPower[4] && passwordInputInValidator.value.length>=4){
                range1.classList.add("weak-password");
                range2.classList.add("weak-password");
                passwordStrengthValueShow.textContent="Weak password"
            }
            else if(passwordPower[4] && passwordInputInValidator.value.length>2){
                range1.classList.add("weak-password");
                passwordStrengthValueShow.textContent="Weak password"
            }
            else{
                [...allRanges.children].forEach((element)=>{
                    element.classList.remove("weak-password");
                    element.classList.remove("good-password");
                    element.classList.remove("strong-password");
                })
                passwordStrengthValueShow.textContent="Weak password"
            }
            if (passwordPower[0]){
                upperWord.textContent="✓    One upper-case";
                upperWord.classList.remove("condition-wrong");
                if (!upperWord.classList.contains("condition-correct")){
                    upperWord.classList.add("condition-correct");
                }
            }
            else{
                upperWord.textContent="✗    One upper-case";
                upperWord.classList.remove("condition-correct");
                if (!upperWord.classList.contains("condition-wrong")){
                    upperWord.classList.add("condition-wrong");
                }
            }
            if (passwordPower[1]){
                lowerWord.textContent="✓    One lower-case";
                lowerWord.classList.remove("condition-wrong");
                if (!lowerWord.classList.contains("condition-correct")){
                    lowerWord.classList.add("condition-correct");
                }
            }
            else{
                lowerWord.textContent="✗    One lower-case";
                lowerWord.classList.remove("condition-correct");
                if (!lowerWord.classList.contains("condition-wrong")){
                    lowerWord.classList.add("condition-wrong");
                }
            }
            if (passwordPower[2]){
                specialWord.textContent="✓    One special-character";
                specialWord.classList.remove("condition-wrong");
                if (!specialWord.classList.contains("condition-correct")){
                    specialWord.classList.add("condition-correct");
                }
            }
            else{
                specialWord.textContent="✗    One special-character";
                specialWord.classList.remove("condition-correct");
                if (!specialWord.classList.contains("condition-wrong")){
                    specialWord.classList.add("condition-wrong");
                }
            }
            if (passwordPower[3]){
                numberWord.textContent="✓    One number";
                numberWord.classList.remove("condition-wrong");
                if (!numberWord.classList.contains("condition-correct")){
                    numberWord.classList.add("condition-correct");
                }
            }
            else{
                numberWord.textContent="✗    One number";
                numberWord.classList.remove("condition-correct");
                if (!numberWord.classList.contains("condition-wrong")){
                    numberWord.classList.add("condition-wrong");
                }
            }
            if (passwordPower[4]){
                nospaceWord.textContent="✓    No-spaces";
                nospaceWord.classList.remove("condition-wrong");
                if (!nospaceWord.classList.contains("condition-correct")){
                    nospaceWord.classList.add("condition-correct");
                }
            }
            else{
                nospaceWord.textContent="✗    No-spaces";
                nospaceWord.classList.remove("condition-correct");
                if (!nospaceWord.classList.contains("condition-wrong")){
                    nospaceWord.classList.add("condition-wrong");
                }
            }
            if (passwordPower[5]){
                morethan12Word.textContent="✓    Minimum 12 character";
                morethan12Word.classList.remove("condition-wrong");
                if (!morethan12Word.classList.contains("condition-correct")){
                    morethan12Word.classList.add("condition-correct");
                }
            }
            else{
                morethan12Word.textContent="✗    Minimum 12 character";
                morethan12Word.classList.remove("condition-correct");
                if (!morethan12Word.classList.contains("condition-wrong")){
                    morethan12Word.classList.add("condition-wrong");
                }
            }
        })
        showValidatorPassword.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showValidatorPasswordSituvation){
                showValidatorPasswordSituvation=false;
                showValidatorPasswordIcon.setAttribute("src","fortify-icons/eye-off.svg");
                passwordInputInValidator.type="password";
            }
            else{
                showValidatorPasswordSituvation=true;
                showValidatorPasswordIcon.setAttribute("src","fortify-icons/eye.svg");
                passwordInputInValidator.type="text";
            }
        })
    }
    if (oneTimeValidation){
        oneTimeValidation=false;
        onetimeRunInValidator();
    }
}
function editPasswordPage(websiteName){
    let closePage=document.querySelector(".close-edit-password-page");
    let addPasswordForm=document.querySelector(".edit-apssword-form");
    let showNewPassword=document.querySelector(".show-entered-password-edit")
    let showNewPasswordIcon=showNewPassword.firstChild;
    let showNewPasswordSituvation=false;
    let tempWebsiteDetail=(JSON.parse(localStorage.getItem("passwords")) || []).filter((element)=>element.usermail===sessionStorage.getItem("user") && element.website===websiteName)[0] || [];

    let passwordInput=document.querySelector("#new-password-edit");
    let websiteInput=document.querySelector("#website-name-edit");
    let usenameInput=document.querySelector("#user-name-edit");
    let passwordStrength=document.querySelector(".new-password-strength-edit");

    websiteInput.value=tempWebsiteDetail.website;
    usenameInput.value=tempWebsiteDetail.username;
    passwordInput.value=decrypt(tempWebsiteDetail.password);
    passwordStrength.textContent=tempWebsiteDetail.strength+" password";

    if (!document.querySelector(".add-password-whole-page")){
        document.querySelector(".add-password-whole-page").classList.add("hide-page");
    }

    function oneTimeEdit(){
        closePage.addEventListener("click",()=>{
            document.querySelector(".edit-password-whole-page").classList.add("hide-page");
        })
        showNewPassword.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showNewPasswordSituvation){
                showNewPasswordSituvation=false;
                showNewPasswordIcon.setAttribute("src","fortify-icons/eye-off.svg");
                passwordInput.type="password";
            }
            else{
                showNewPasswordSituvation=true;
                showNewPasswordIcon.setAttribute("src","fortify-icons/eye.svg");
                passwordInput.type="text";
            }
        })
        addPasswordForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            let passwordList=JSON.parse(localStorage.getItem("passwords")) || [];
            passwordList.forEach((element)=>{
                if (element.usermail==sessionStorage.getItem("user") && element.website==websiteInput.value){
                    element.username=usenameInput.value;
                    element.password=encrypt(passwordInput.value);
                    element.strength=(passwordStrength.textContent).split(" ")[0];
                    element.lastupdatedtime=new Date();
                }
            });
            saveHistory("Password edited",websiteInput.value,"The website password edited");
            document.querySelector(".edit-password-whole-page").classList.add("hide-page");
            popupMessage("Updated successfully");
            localStorage.setItem("passwords",JSON.stringify(passwordList));
            pushPasswordsInPage();
            
        })
        passwordInput.addEventListener("input",()=>{
            let passwordPower=passwordValidation(passwordInput.value);
            passwordStrength.classList.remove("strong");
            passwordStrength.classList.remove("weak");
            passwordStrength.classList.remove("good");
            if (passwordPower.every((element)=>element)){
                passwordStrength.textContent="Strong password";
                passwordStrength.classList.add("strong");
            }
            else if (passwordPower.filter((element)=>element).length>=4 && passwordPower[4]){
                passwordStrength.textContent="Good password";
                passwordStrength.classList.add("good");
            }
            else if (passwordPower.filter((element)=>element).length>2 && passwordPower[4] && passwordInput.value.length>=4){
                passwordStrength.textContent="Weak password";
                passwordStrength.classList.add("weak");
            }
            else{
                passwordStrength.textContent="Weak password";
                passwordStrength.classList.add("weak");
            }
        })
    }
    if (oneTimeEditSituvation){
        oneTimeEditSituvation=false;
        oneTimeEdit();
    }
}
function addPasswordPage(){
    let closePage=document.querySelector(".close-add-password-page");
    let addPasswordForm=document.querySelector(".add-apssword-form");
    let showNewPassword=document.querySelector(".show-entered-password")
    let showNewPasswordIcon=showNewPassword.firstChild;
    let showNewPasswordSituvation=false;

    let passwordInput=document.querySelector("#new-password");
    let websiteInput=document.querySelector("#website-name");
    let usenameInput=document.querySelector("#user-name");
    let websiteErrorMessage=document.querySelector(".website-error");
    let passwordStrength=document.querySelector(".new-password-strength");

    passwordStrength.textContent="";
    websiteInput.value="";
    usenameInput.value="";
    passwordInput.value="";
    websiteErrorMessage.textContent="";

    function oneTimeAdd(){
        usenameInput.addEventListener("input",()=>{
            usenameInput.value=usenameInput.value.trim()
        })
        websiteInput.addEventListener("input",()=>{
            websiteInput.value=websiteInput.value.trim()
        })
        passwordInput.addEventListener("input",()=>{
            passwordInput.value=passwordInput.value.trim()
        })
        closePage.addEventListener("click",()=>{
            document.querySelector(".add-password-whole-page").classList.add("hide-page");
        })
        showNewPassword.addEventListener("click",(e)=>{
            e.preventDefault();
            if(showNewPasswordSituvation){
                showNewPasswordSituvation=false;
                showNewPasswordIcon.setAttribute("src","fortify-icons/eye-off.svg");
                passwordInput.type="password";
            }
            else{
                showNewPasswordSituvation=true;
                showNewPasswordIcon.setAttribute("src","fortify-icons/eye.svg");
                passwordInput.type="text";
            }
        })
        addPasswordForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            let passwordList=JSON.parse(localStorage.getItem("passwords")) || [];
            let userPasswordList=passwordList.filter((element)=>element.usermail==sessionStorage.getItem("user"));
            let trashList=JSON.parse(localStorage.getItem("trash")) || [];
            let userTrashList=trashList.filter((element)=>element.usermail==sessionStorage.getItem("user"));
            if (userPasswordList.filter((element)=>element.website.toLowerCase()==websiteInput.value.toLowerCase()).length!=0){
                websiteErrorMessage.textContent="Domain already exists"
            }
            else if (userTrashList.filter((element)=>element.website.toLowerCase()==websiteInput.value.toLowerCase()).length!=0){
                websiteErrorMessage.textContent="Domain already exists in trash"
            }
            else{
                let tempObj={};
                tempObj.website=websiteInput.value;
                tempObj.username=usenameInput.value;
                tempObj.password=encrypt(passwordInput.value);
                tempObj.createdtime=new Date();
                tempObj.lastupdatedtime=new Date();
                tempObj.usermail=sessionStorage.getItem("user");
                tempObj.sharedusers=[];
                tempObj.strength=(passwordStrength.textContent).split(" ")[0];
                tempObj.favourite=false;
                passwordList.push(tempObj);
                localStorage.setItem("passwords",JSON.stringify(passwordList));
                passwordStrength.textContent="";
                websiteInput.value="";
                usenameInput.value="";
                passwordInput.value="";
                websiteErrorMessage.textContent="";
                pushPasswordsInPage();
                popupMessage("Added successfully");
                saveHistory("Password added",tempObj.website,"New password added")
                document.querySelector(".add-password-whole-page").classList.add("hide-page");
            }
        })
        passwordInput.addEventListener("input",()=>{
            let passwordPower=passwordValidation(passwordInput.value);
            passwordStrength.classList.remove("strong");
            passwordStrength.classList.remove("weak");
            passwordStrength.classList.remove("good");
            if (passwordPower.every((element)=>element)){
                passwordStrength.textContent="Strong password";
                passwordStrength.classList.add("strong");
            }
            else if (passwordPower.filter((element)=>element).length>=4 && passwordPower[4]){
                passwordStrength.textContent="Good password";
                passwordStrength.classList.add("good");
            }
            else if (passwordPower.filter((element)=>element).length>2 && passwordPower[4] && passwordInput.value.length>=4){
                passwordStrength.textContent="Weak password";
                passwordStrength.classList.add("weak");
            }
            else if (passwordInput.value==""){
                passwordStrength.textContent="";
                passwordStrength.classList.remove("strong");
                passwordStrength.classList.remove("weak");
                passwordStrength.classList.remove("good");
            }
            else{
                passwordStrength.textContent="Weak password";
                passwordStrength.classList.add("weak");
            }
        })
    }
    if (oneTimeAddSituvation){
        oneTimeAddSituvation=false;
        oneTimeAdd();
    }
    
}
function allPasswordsPage(){
    let passwordGeneratorButton=document.querySelector(".generator-option");
    let passwordValidatorButton=document.querySelector(".validator-option");
    let generatorFullPage=document.querySelector(".password-generator-page");
    let validatorFullPage=document.querySelector(".password-validator-page");

    function oneTimeAll(){
        passwordGeneratorButton.addEventListener("click",()=>{
            generatorFullPage.classList.remove("hide-page");
            passwordGenerator();
        })
        passwordValidatorButton.addEventListener("click",()=>{
            validatorFullPage.classList.remove("hide-page");
            passwordValidationPage();
        })
    }
    if (oneTimeAllSituvation){
        oneTimeAllSituvation=false;
        oneTimeAll();
    }
}
if (!JSON.parse(localStorage.getItem("session")) || JSON.parse(localStorage.getItem("session")).expiryTime < Date.now()){
    window.location.href="passwordspace1.html";
}
sessionStorage.setItem("user",JSON.parse(localStorage.getItem("session")).user)
setInterval(()=>{
        if (JSON.parse(localStorage.getItem("session")) && JSON.parse(localStorage.getItem("session")).expiryTime < Date.now()){
            location.reload();
            window.location.href="passwordspace1.html";
        }
},5000)

let themeButton=document.querySelector(".mode-button");
themeButton.addEventListener("click",()=>{
    if (document.querySelector("body").dataset.theme==="dark"){
        document.querySelector("body").dataset.theme="light";
        themeButton.firstChild.setAttribute("src","fortify-icons/dark-mode-moon.svg");
    }
    else{
        document.querySelector("body").dataset.theme="dark";
        themeButton.firstChild.setAttribute("src","fortify-icons/light-mode-sun.svg");
    }
    updateDetail();
})

let addPasswordButton=document.querySelector(".add-password-button");

let allOptions=document.querySelector(".options");
let workingWholePage=document.querySelector(".all-works-page");

let option1=document.querySelector(".option1");
let option2=document.querySelector(".option2");
let option3=document.querySelector(".option3");
let option4=document.querySelector(".option4");
let option5=document.querySelector(".option5");
let option6=document.querySelector(".option6");
let option7=document.querySelector(".view-more");
let option8=document.querySelector(".option7");
let option9=document.querySelector(".option8");
let option10=document.querySelector(".option9");

let searchPassword=document.querySelector(".search-password");

let oneTimeValidation=true;
let oneTimeGenerateSituvation=true;
let oneTimeAllSituvation=true;
let oneTimeAddSituvation=true;
let oneTimeEditSituvation=true;
let oneTimeShowPasswordSituvation=true;
let chart1Password,chart2Password;

addPasswordButton.addEventListener("click",()=>{
    document.querySelector(".add-password-whole-page").classList.remove("hide-page");
    addPasswordPage();
})
option1.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option1.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option1.dataset.classname).classList.remove("hide-page");
    allPasswordsPage();
})
option2.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option2.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option2.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
option3.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option3.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option3.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
option4.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option4.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option4.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
option5.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option5.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option5.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
option6.addEventListener("click",()=>{
    option8.click();
})
option7.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option5.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option5.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
option8.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option8.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option8.dataset.classname).classList.remove("hide-page");
    updateDetail();
})
option9.addEventListener("click",()=>{
    option8.click();
})
option10.addEventListener("click",()=>{
    [...allOptions.children].forEach((element)=>element.classList.remove("option-active"));
    option10.classList.add("option-active");
    [...workingWholePage.children].forEach((element)=>{
        if (!element.classList.contains("hide-page")){
            element.classList.add("hide-page");
        }
    })
    document.querySelector(option10.dataset.classname).classList.remove("hide-page");
    pushPasswordsInPage();
})
searchPassword.addEventListener("input",()=>{
    pushPasswordsInPage();
})
let userDetailPTag=document.querySelector(".user-detail");
let currentUserNameTag=document.querySelector(".current-user-name");
let logoutSection=document.querySelector(".user-logout-section");
let logoutButton=document.querySelector(".logout");
updateDetail();
option8.click(); 
pushPasswordsInPage();
userDetailPTag.addEventListener("click",(e)=>{
    e.stopPropagation();
    logoutSection.classList.toggle("hide-page");
})
document.addEventListener("click",(e)=>{
    if (!logoutSection.classList.contains("hide-page")){
        logoutSection.classList.add("hide-page");
    }
})
logoutButton.addEventListener("click",()=>{
    localStorage.removeItem("session");
    window.location.href="passwordspace1.html";
})
