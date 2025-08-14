function pmessfunc(value, message){
    const pmess = document.getElementById('pmess');
    const red = 'hsl(0, 100%, 40%)';
    const green = 'hsl(120, 100%, 30%)';

    if(value){
        pmess.innerHTML = `<i class="fas fa-circle-check"></i>
                            &nbsp;${message}`;
        pmess.style.color = green;
        pmess.style.borderLeftColor = green;
        pmess.style.top = '10%';       
        
    } else {
        pmess.innerHTML = `<i class="fas fa-circle-xmark"></i>
                            &nbsp;${message}`;
        pmess.style.color = red;
        pmess.style.borderLeftColor = red;
        pmess.style.top = '10%';
    }
    clearTimeout();
    setTimeout(() => {
        pmess.style.top = '-110%';
    }, 2000);
}

// Register

async function register() {
    const rnewUserFirstname = document.getElementById('newUserFirstname').value;
    const rnewUserLastname = document.getElementById('newUserLastname').value;
    const rnewUserEmail = document.getElementById('newUserEmail').value;
    const rnewUserPhoneNo = document.getElementById('newUserPhoneNo').value;
    const rnewUserPassword = document.getElementById('newUserPassword').value;
    const rsecurityQuestion = document.getElementById('rsecurityQuestion').value;
    const rsecurityAnswer = document.getElementById('rsecurityAnswer').value;

    const firstName = rnewUserFirstname.trim().charAt(0).toUpperCase() + rnewUserFirstname.trim().slice(1).toLowerCase();
    const lastName = rnewUserLastname.trim().charAt(0).toUpperCase() + rnewUserLastname.trim().slice(1).toLowerCase();
    
    const newUsername = `${firstName} ${lastName}`;
    const newUserPhoneNo = rnewUserPhoneNo.trim();
    const newUserEmail = rnewUserEmail.trim();
    const newUserPassword = rnewUserPassword;
    const newUserSecQuestion = rsecurityQuestion.trim().toLowerCase();
    const newUserSecAnswer = rsecurityAnswer.trim().toLowerCase();

    if(newUsername && newUserPhoneNo && newUserEmail && newUserPassword && newUserSecQuestion && newUserSecAnswer){
        if(newUserPassword.length < 8){pmessfunc(false, 'Password must be more than 8 characters')}
        else{
            try{ 
                const res = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        newUsername: `${newUsername}`,
                        newUserEmail: `${newUserEmail}`,
                        newUserPhoneNo: `${newUserPhoneNo}`,
                        newUserPassword: `${newUserPassword}`,
                        newUserSecQuestion: `${newUserSecQuestion}`,
                        newUserSecAnswer: `${newUserSecAnswer}`
                    })
                });

                const data = await res.json();
                
                if(res.ok){
                    pmessfunc(true, data.message);
                    setTimeout(async () => {
                        const res = await fetch('/login', {method: 'GET'});
                        window.location = res.url;
                    }, 2000);
                    
                } else {
                    pmessfunc(false, data.message);
                }
            } catch(err){
                if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
            }
        }
    } else {pmessfunc(false, 'Please complete the form')}
         
}


// Login

async function login() {
    const luserEmail = document.getElementById('useremail').value;
    const luserPassword = document.getElementById('userpassword').value;

    const userEmail = luserEmail.trim();
    const userPassword = luserPassword;
    if(userEmail && userPassword){
        if(userPassword.length < 8){pmessfunc(false, 'Password must be more than 8 characters')}
        else{
            try{
                const res = await fetch ('/login', { 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        userEmail: `${userEmail}`,
                        userPassword: `${userPassword}`
                    })
                });

                const data = await res.json();
                
                if(res.ok){
                    pmessfunc(true, data.message);
                    setTimeout(async () => {
                        const res = await fetch(`/home?email=${data.email}`, { method: 'GET' });
                        window.location = res.url;
                    }, 2000);
                } else {
                    pmessfunc(false, data.message);
                }
            } catch(err){
                if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
            }
        }
    } else {pmessfunc(false, 'Please complete the form')}
}

//Reser Password

async function resetPass() {
    const rsUserEmail = document.getElementById('rsUserEmail').value;
    const rsSecurityQuestion = document.getElementById('rsSecurityQuestion').value;
    const rsSecurityAnswer = document.getElementById('rsSecurityAnswer').value;
    const rsNewPassword = document.getElementById('rsNewPassword').value;

    const userEmail = rsUserEmail.trim();
    const userSecQuestion = rsSecurityQuestion.trim().toLowerCase();
    const userSecAnswer = rsSecurityAnswer.trim().toLowerCase();
    const newPassword = rsNewPassword;
    if(userEmail && userSecQuestion && userSecAnswer && newPassword){
        if(newPassword.length < 8){pmessfunc(false, 'Password must be more than 8 characters')}
        else{
            try{
                const res = await fetch ('/reset-password', { 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        userEmail: `${userEmail}`,
                        userSecQuestion: `${userSecQuestion}`,
                        userSecAnswer: `${userSecAnswer}`,
                        newPassword: `${newPassword}`
                    })
                });

                const data = await res.json();
                
                if(res.ok){
                    pmessfunc(true, data.message);
                    setTimeout(async () => {
                        const res = await fetch(`/login`, { method: 'GET' });
                        window.location = res.url;
                    }, 2000);
                } else {
                    pmessfunc(false, data.message);
                }
            } catch(err){
                if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
            }
        }
    } else {pmessfunc(false, 'Please complete the form')}
}

// Logout

async function logout() {
    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;

    try{
        const res = await fetch ('/logout', { 
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: `${email}` })
        });
        const data = await res.json();  
    
        if(res.ok){
            pmessfunc(true, data.message);
            setTimeout(async () => {
                const res = await fetch('/login', {method: 'GET'});
                window.location = res.url;
            }, 2000);
            
        } else {
            pmessfunc(false, data.message);
        }
    } catch(err){
        if(err) pmessfunc(false, `Server Error: (${err.name}). Refresh the browser.`);
    }
}

// Delete Account

async function delAccount() {
    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;

    try{
        const res = await fetch ('/login', { 
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: `${email}` })
        });
        const data = await res.json();  
    
        if(res.ok){
            pmessfunc(true, data.message);
            setTimeout(async () => {
                const res = await fetch('/login', {method: 'GET'});
                window.location = res.url;
            }, 2000);            
        } else {
            pmessfunc(false, data.message);
        }
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}


// Set Theme

async function setTheme() {        
    const lightTheme = document.getElementById('light');
    const darkTheme = document.getElementById('dark');

    const logoimg = document.getElementById('logoimg');

    const urlEmail = window.location.search;
    const email = urlEmail.slice(urlEmail.indexOf('=') + 1);

    try{
        const res = await fetch (`/home/user?email=${email}`, { method: 'GET' });
        const data = await res.json();

        if(res.ok){
            switch(data.theme){
                case 'light' :
                    logoimg.src = 'public/resources/black logo.png';
                    document.body.classList.remove('dark-theme');
                    document.body.classList.add('light-theme');
                    lightTheme.checked = true;                    
                    break;                    
                case 'dark' :
                    logoimg.src = 'public/resources/white logo.png';
                    document.body.classList.remove('light-theme');
                    document.body.classList.add('dark-theme');
                    darkTheme.checked = true;                    
                    break;                    
            }
        }
                
    } catch (err){
        if(err) throw new Error(err);
    }
}

async function userTheme(choice) {
    const urlEmail = window.location.search;
    const email = urlEmail.slice(urlEmail.indexOf('=') + 1);

    const theme = choice;

    try{
        const res = await fetch('/home/user', {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: `${email}`, theme: `${theme}` })
        });
        const data = await res.json();

        if(res.ok){
            setTheme();
            pmessfunc(true, data.message);
        } else{pmessfunc(false, data.message)}
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}


// Home Load
async function homeLoad() {
    const contactsPage = document.getElementById('contacts');
    const favContactsPage = document.getElementById('favorites');

    const loginLink = document.getElementById('login-link');

    const husername1 = document.getElementById('husername1');
    const husername2 = document.getElementById('husername2');
    const husername3 = document.getElementById('husername3');
    const huseremail1 = document.getElementById('huseremail1');
    const huseremail2 = document.getElementById('huseremail2');
    const huserphoneno = document.getElementById('huserphoneno');

    const urlEmail = window.location.search;
    const email = urlEmail.slice(urlEmail.indexOf('=') + 1);
    try{
        const res = await fetch (`/home/user?email=${email}`, { method: 'GET' });
        const data = await res.json();

        
        if(res.ok){
            setTheme();
            const firstName = data.username.slice(0, data.username.indexOf(' ')).trim();
            loginLink.style.display = 'none';
            husername1.innerHTML = data.username;
            husername2.innerHTML = firstName;
            husername3.innerHTML = data.username;
            huseremail1.innerHTML = data.email;
            huseremail2.innerHTML = data.email;
            huserphoneno.innerHTML = data.phone;
            husername1.title = data.username.toUpperCase();
            husername2.title = data.username.toUpperCase();
            husername3.title = data.username.toUpperCase();
            huseremail1.title = data.email;
            huseremail2.title = data.email;
            huserphoneno.title = data.phone;
        } else {
            contactsPage.innerHTML = '<a href="/login" title="Login" class="mustlogin">Please login</a>';
            favContactsPage.innerHTML = '<a href="/login" title="Login" class="mustlogin">Please login</a>';
        }
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}

// Home Page

function createUlElement(content){
    const ul = document.createElement('ul');
    
    for (i=0; i < content.length; i++){
        const li = document.createElement('li');
        li.textContent = content[i];
        ul.append(li);
    }

    ul.style.transform = 'rotateY(180deg)';
    return ul;
}

const label1con = label1.innerHTML;
const label2con = label2.innerHTML;
const label3con = label3.innerHTML;
const label4con = label4.innerHTML;

function card(){
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    const card3 = document.getElementById('card3');
    const card4 = document.getElementById('card4');

    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const label3 = document.getElementById('label3');
    const label4 = document.getElementById('label4');


    const content1 = [
        'Navigate to the Contact section', 
        'Click the add button at the bottom right',
        'Input contact details',
        'Click save to save contact'
    ];

    const content2 = [
        'Navigate to the Contact section', 
        'Click on the contact you want to edit',
        'Edit contact details',
        'Click save to save edit'
    ];

    const content3 = [
        'Navigate to the Contact section', 
        'Click on the contact you want to tag favorite',
        'Toggle on/off the Add to Favorite button',
        'Click save to save preference'
    ];

    const content4 = [
        'Navigate to the Contact section', 
        'Look for the contact you want to delete',
        'Click the delete button to delete contact'
    ];


    if(card1.checked){  
        const ul = createUlElement(content1);        
        label1.style.transform = 'rotateY(180deg)';
        label1.innerHTML = '';
        label1.append(ul);
    } else{
        label1.style.transform = 'rotateY(0deg)';
        label1.innerHTML = label1con;
    }

    if(card2.checked){    
        const ul = createUlElement(content2);        
        label2.style.transform = 'rotateY(180deg)';
        label2.innerHTML = '';
        label2.append(ul);
    } else{
        label2.style.transform = 'rotateY(0deg)';
        label2.innerHTML = label2con;
    }

    if(card3.checked){  
        const ul = createUlElement(content3);        
        label3.style.transform = 'rotateY(180deg)';
        label3.innerHTML = '';
        label3.append(ul);
    } else{
        label3.style.transform = 'rotateY(0deg)';
        label3.innerHTML = label3con;
    }

    if(card4.checked){ 
        const ul = createUlElement(content4);        
        label4.style.transform = 'rotateY(180deg)';
        label4.innerHTML = '';
        label4.append(ul);
    } else{
        label4.style.transform = 'rotateY(0deg)';
        label4.innerHTML = label4con;
    }

}

function display(){
    const menu = document.getElementById('menu');
    menu.checked = false;
}

// CONTACT

function clearAddContactInput(){
    const aname = document.getElementById('addname');
    const aphone = document.getElementById('addphoneno');
    const aisFav = document.getElementById('fav-on');

    let checkbox = document.getElementById('addcontactform');

    if(!checkbox.checked){
        aname.value = '';
        aphone.value = '';
        aisFav.checked = false; 
    }
}

//Contacts functions

function li(id, name, phone, isFav){
    const li = document.createElement('li');
    li.classList = 'contact-item';
    li.id = `${id}`;
    li.innerHTML = `<label for="editcontactinfo" class="contact-name" onclick="edit()"><i class="fas fa-user-circle"></i>&nbsp;&nbsp;${name}</label>
                <p style="display: none;" id="">${phone}</p>
                <p style="display: none;">${isFav}</p>
                <span class="fas fa-trash" onclick="delContact()" title="Delete"></span>`;

    return li;
}

function favli(id, name, phone, isFav){
    const li = document.createElement('li');
    li.classList = 'contact-item';
    li.id = `${id}`;
    li.innerHTML = `<span class="contact-name"><i class="fas fa-user-circle"></i>&nbsp;&nbsp;${name}</span>
                <p style="display: none;">${phone}</p>
                <p style="display: none;">${isFav}</p>
                <span class="fas fa-heart" onclick="favContact()" title="Favorite"></span>`;
    
    return li;
}

async function loadContacts(){
    const contactsCon = document.getElementById('contacts');

    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;
    const contactList = document.getElementById('contact-list');
    const numOfCon = document.getElementById('numofcontacts');

    try{
        const res = await fetch (`/contacts?email=${email}`, { method: 'GET' });
        const data = await res.json();
        if(res.ok){
            const datas = data.contacts;
            datas.sort((a, b) => a.name.localeCompare(b.name));
            const contacts = datas;
            contactList.innerHTML = '';
            
            for(i=0; i < contacts.length; i++){
                const dcon = contacts[i];
                contactList.append(li(dcon.id, dcon.name, dcon.phone, dcon.isFav));
            }
            if(contactList.innerHTML === ''){
                contactList.innerHTML = `<i class="i">No saved contacts</i>`;
            }
            numOfCon.textContent = `(${contacts.length})`;
        } else {
            contactsCon.innerHTML = `<i class="mustlogin">Loading...</i>`;
        }
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}

async function loadFavContacts(){
    const favcontactsCon = document.getElementById('favorites');
    
    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;
    const favoriteList = document.getElementById('favorite-list');
    const numOfFavCon = document.getElementById('numoffavcontacts');

    try{
        const res = await fetch (`/contacts/fav?email=${email}`, { method: 'GET' });
        const data = await res.json();
        if(res.ok){
            const datas = data.contacts;
            datas.sort((a, b) => a.name.localeCompare(b.name));
            const contacts = datas;    
            favoriteList.innerHTML = '';
            
            for(i=0; i < contacts.length; i++){
                const dcon = contacts[i];
                favoriteList.append(favli(dcon.id, dcon.name, dcon.phone, dcon.isFav));
            }
            if(favoriteList.innerHTML === ''){
                favoriteList.innerHTML = `<i class="i">No favorite contacts</i>`;
            }
            numOfFavCon.textContent = `(${contacts.length})`;
        } else {
            favcontactsCon.innerHTML = `<i class="mustlogin">Loading...</i>`;
        }
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}

async function addContact(){
    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;
    
    const name = document.getElementById('addname').value.trim();
    const phone = document.getElementById('addphoneno').value.trim();
    const isFav = document.getElementById('fav-on').checked;
    
    const checkbox = document.getElementById('addcontactform');
    
    if(name && phone){        
        try{
            const res = await fetch('/contacts', 
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                    email: `${email}`, 
                    name: `${name}`, 
                    phone: `${phone}`, 
                    isFav: isFav
                })
                }
            )
            const data = await res.json();
            if(res.ok){
                pmessfunc(true, data.message);
                loadContacts();            
                checkbox.checked = false;
                clearAddContactInput();
            } else{pmessfunc(false, data.message)}
        } catch(err){
            if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
        }
    } else {
        checkbox.checked = true;
        pmessfunc(false, 'Please complete the form')
    }
}

async function delContact(){
    const checkbox = document.getElementById('editcontactinfo');

    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;
    
    const pId = document.getElementById('edconinfoid').innerHTML;
    const li = event.target.parentElement;
    let id;

    if(li.className == 'contact-item') { id = li.id; }
    else{ id = pId; }

    try{
        const res = await fetch(`/contacts`, 
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    email: `${email}`, 
                    id: id
                })
            }
        );

        const data =  await res.json();
        if(res.ok){
            pmessfunc(true, data.message);
            loadContacts();
            search();
            checkbox.checked = false;
        } else{pmessfunc(false, data.message)}
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
}

async function favContact(){
    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;

    const pId = document.getElementById('edconinfoid').innerHTML;
    const li = event.target.parentElement;
    let id;

    const pIsfav = document.getElementById('favbutton');
    let isFav;

    if(li.className == 'contact-item') { 
        id = li.id;
        isFav = false;
    } else{ 
        id = pId;
        isFav = pIsfav.checked;
    }

    try{
        const res = await fetch(`/contacts/favorite`, 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    email: `${email}`, 
                    id: id, 
                    isFav: isFav
                })
            }
        );
        
        const data =  await res.json();
        if(res.ok){
            pmessfunc(true, data.message);
            loadFavContacts();
            search();
        } else {pmessfunc(false, data.message)}
    } catch(err){
        if(err) pmessfunc(false, `Server Errorr. Refresh the browser.`);
    }
}

async function edit(){
    const pId = document.getElementById('edconinfoid');
    const name = document.getElementById('edconinfoname');
    const phoneno = document.getElementById('edconinfophone');
    const isfav = document.getElementById('favbutton');

    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;

    const self = event.target;
    const li = self.parentElement;
    const id = li.id;

    try{
        const res = await fetch(`/contacts/edit?email=${email}&id=${id}`, { method: 'GET' });
        
        const data =  await res.json();
        const contact = data.contact;
        if(res.ok){
            pId.innerHTML = contact.id;
            name.innerHTML = contact.name;
            phoneno.innerHTML = contact.phone;
            isfav.checked = contact.isFav; 
        } else{pmessfunc(false, data.message)}
    } catch(err){
        if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
    }
    
}

async function collectEditInfo(){
    const pId = document.getElementById('edconinfoid').innerHTML;
    const pName = document.getElementById('edconinfoname').innerHTML;
    const pPhone = document.getElementById('edconinfophone').innerHTML;
    const pIsfav = document.getElementById('favbutton').checked;

    const id = document.getElementById('editid');
    const name = document.getElementById('editname');
    const phone = document.getElementById('editphoneno');
    const isFav = document.getElementById('favtoggle');

    const checkbox = document.getElementById('editcontactform');
    const checkbox2 = document.getElementById('editcontactinfo');

    if(checkbox.checked){
        id.innerHTML = pId;
        name.value = pName;
        phone.value = pPhone;
        isFav.checked = pIsfav;
        checkbox2.checked = false;
    }
}

async function editContact(){
    const id = document.getElementById('editid').innerHTML;
    const name = document.getElementById('editname').value.trim();
    const phone = document.getElementById('editphoneno').value.trim();
    const isFav = document.getElementById('favtoggle').checked;

    const checkbox = document.getElementById('editcontactform');

    const huseremail1 = document.getElementById('huseremail1');
    const email = huseremail1.innerHTML;
    
    if(name && phone){
        try{
            const res = await fetch(`/contacts`, 
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        email: `${email}`, 
                        id: id, 
                        name: `${name}`, 
                        phone: `${phone}`, 
                        isFav: isFav
                    })
                }
            )    
            const data =  await res.json();
            if(res.ok){
                pmessfunc(true, data.message);
                loadContacts();
                checkbox.checked = false;
            } else {
                pmessfunc(false, data.message);
                checkbox.checked = true;
            }
        } catch(err){
            if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
        }
    } else{pmessfunc(false, 'Please complete the form')}
}
  
async function search(){
    const searchInput = document.getElementById('searchInput');  
    const email = document.getElementById('huseremail1').textContent;

    const searchCon = document.getElementById('searchcontainer');
    
    const name = searchInput.value.trim();

    if(name){
        try{
            const res = await fetch(`/contacts/search?email=${email}&name=${name}`, {method: 'GET'});
            const data = await res.json();
            const datas = data.contacts;
            datas.sort((a, b) => a.name.localeCompare(b.name));
            const matchedContacts = datas;
            searchCon.innerHTML = '';

            if(res.ok){
                for(i=0; i < matchedContacts.length; i++){
                    const dcon = matchedContacts[i];
                    searchCon.append(li(dcon.id, dcon.name, dcon.phone, dcon.isFav));
                }
                if(searchCon.innerHTML === ''){
                    searchCon.innerHTML = '<i class="i">No contact found</i>'
                }
            } else {pmessfunc(false, data.message)}
        } catch(err){
            if(err) pmessfunc(false, `Server Error. Refresh the browser.`);
        }

    } else {searchCon.innerHTML = '<i class="i">Please enter name of contact</i>'}

}

function clearSearch(){
    const searchInput = document.getElementById('searchInput');
    const searchCon = document.getElementById('searchcontainer');

    searchInput.value = '';
    searchCon.innerHTML = '';
}

function closeSearch(){
    const checkbox = document.getElementById('searchcontainer');
    checkbox.checked = false;
}