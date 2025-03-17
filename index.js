//------- Start Login ------//
function Login() {
    const login = `<div class="container">
        <form method="POST" id="loginForm" autocomplete="off">
            <h3 class="title">login</h3>
            <div>
                <label for="username">Username / Email</label>
                <input type="text" name="username" id="username">
                <span id="errusername" for="">testerr</span>
            </div>

            <div class="password">
                <label for="password">password</label>
                <div>
                    <input type="password" name="password" id="password" class="password">
                    <button id="showpassword" class="showpassword">Show</button>
                </div>
                <span id="err" for="">testerr</span>

            </div>
            
            <div>
                <input type="submit" value="Login">
            </div>

        </form>
    </div>
`;
    document.getElementById('app').innerHTML = login;
    // document.body.innerHTML = login;

    // setupPasswordToggle() {
    const showpassword = document.getElementById("showpassword");
    const password = document.getElementById("password");

    let show = false

    showpassword?.addEventListener("click", (e) => {
        e.preventDefault()
        if (!show) {
            password.type = "text";
            showpassword.textContent = "Hide";
        } else {
            password.type = "password";
            showpassword.textContent = "Show";
        }
        show = !show
    });
    // }

    // setupFormSubmission() {
    // Get the form element
    const form = document.getElementById('loginForm')
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit()
    });

    // }

}

function handleSubmit() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const credentials = btoa(`${username.value}:${password.value}`);

    fetch(`https://learn.zone01oujda.ma/api/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${credentials}`
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                const err = document.getElementById('err');
                err.textContent = data.error;
                err.style.display = "block";
            }else{
                //JWT
                home()
            }
        })

}

Login();

//------- End Login ------//

//------- Start Home -----//
function home(){
    let app = document.getElementById('app');
    app.innerHTML = "home";


}

//------- End Home -----//
