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


    // setupPasswordToggle() {
    const password = document.getElementById("password");
    // const username = document.getElementById('username');
    const showpassword = document.getElementById("showpassword");
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
        usernameValue = document.getElementById('username').value;
        passwordValue = document.getElementById("password").value;
        handleSubmit(usernameValue, passwordValue);
    });

    // }

}
Login();

window.addEventListener('DOMContentLoaded', function () {
    const getJWT = localStorage.getItem("jwt");
    if (!getJWT) {
        Login()
    } else {
        home();
    }
});



function handleSubmit(username, password) {

    // const username = document.getElementById('username');
    // const password = document.getElementById('password');
    // const credentials = btoa(`${username.value}:${password.value}`);

    const credentials = btoa(`${username}:${password}`);

    fetch(`https://learn.zone01oujda.ma/api/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${credentials}`
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                const err = document.getElementById('err');
                err.textContent = data.error;
                err.style.display = "block";
            } else {
                //Store JWT token
                localStorage.setItem("jwt", data)
                home()
            }
        })

}

//------- End Login ------//

//------- Start Home -----//
function home() {
    let app = document.getElementById('app');
    app.innerHTML = "";
    //--- Start Create Header
    const header = document.createElement('div');
    header.classList.add("header");
    app.appendChild(header);
    const title = document.createElement('h2');
    title.classList.add("title");
    title.textContent = "graphql"
    const logout = document.createElement('h2');
    logout.classList.add("logout");
    const linkLogout = document.createElement('a');
    linkLogout.classList.add('linkLogout');
    linkLogout.id = "linkLogout";
    linkLogout.textContent = "logout";
    logout.appendChild(linkLogout);
    header.append(title, logout);
    //--- End Create Header

    // document.addEventListener('DOMContentLoaded', function () {

    const Logout = document.getElementById('linkLogout');

    if (Logout) {
        Logout.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("jwt");
            localStorage.clear();
            Login();
        });
    }
    // });

    //--- Start Create first and Last name
    const welcome = document.createElement('div');
    welcome.classList.add("welcome");
    app.appendChild(welcome);
    const container = document.createElement('div');
    container.classList.add("container-welc");
    welcome.appendChild(container);
    const fullName = document.createElement('h2')
    fullName.classList.add("fullName");
    container.appendChild(fullName);
    //--- End Create first and Last name

    //--- Start Section Level and Ratio
    const levelAndRatio = document.createElement('div');
    levelAndRatio.classList.add('levelAndRatio');
    // levelAndRatio.appendChild(container);
    app.appendChild(levelAndRatio);

    const level = document.createElement('div');
    level.classList.add('level');
    levelAndRatio.appendChild(level);

    const ratio = document.createElement('div');
    ratio.classList.add('ratio');
    levelAndRatio.appendChild(ratio);

    const ratioContent = document.createElement('div');
    ratioContent.classList.add('ratioContent');
    ratio.appendChild(ratioContent);
    // const titleAuditRatio = document.createElement('h3');
    // titleAuditRatio.classList.add('titleAuditRatio');
    // titleAuditRatio.classList = "Audits Ratio";
    // ratio.appendChild(titleAuditRatio);

    //--- End Section Level and Ratio

    //--- Start Section Projects
    const projects = document.createElement('div');
    projects.classList.add('projects');
    app.appendChild(projects);
    //--- End Section Projects

    /* Start Section Best Skills */
    const bestSkills = document.createElement('div');
    bestSkills.classList.add('best-skills');
    app.appendChild(bestSkills);
    /* End Section Best Skills */


    // app.innerHTML += "";
    const query = `
        {
            user{
                login
                firstName
                lastName
                totalUp
                totalDown
                auditRatio
            }

            level : transaction (where :{_and :[
                {type : {_eq : "level"}}
                {event: {object: {name: {_eq: "Module"}}}}
            ]}
                order_by :{amount : desc}
                limit :  1
            ){
                type
                amount
            }  
            
            porjects: transaction(
                where: {type: {_eq: "xp"}, _and: [
                {path: {_nlike: "%piscine-go%"}},
                {path: {_nlike: "%piscine-js%"}},
                {path: {_nlike: "%checkpoint/%"}},
                ]}
                order_by: {createdAt: asc}
            ) {
                path
                amount
            }

            skills: user {
                transactions(where: {type: {_like: "skill_%"}}, order_by: {amount: asc}) {
                    type
                    amount
                }
            }
        }
    `;
    // const divData = document.createElement('div');
    // app.append(divData);
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        console.error("JWT not found. Redirecting to login...");
        app.innerHTML = `<p>Authentication required. Please log in.</p>`;
        return;
    }

    fetch(`https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
            query
        })
    })
        .then(response => response.json())
        .then(results => {
            if (results.errors) {
                app.innerHTML = `<p>Error fetching Data</p>`;
                return
            }

            const dataUser = results.data.user
            // // divData.innerHTML = data.user
            dataUser.forEach(ele => {
                fullName.textContent = `Welcome ${ele.firstName} ${ele.lastName}`;
                setTimeout(() => updateGraphRatio(ele.totalUp, ele.totalDown), 0);
                // updateGraphRatio(ele.totalUp, ele.totalDown);
            });
            //--- Start Create Level
            const levelAmount = results.data.level[0].amount;
            const svgLevel = `
                <svg width="100%" height="300">
                    <circle
                        width="80%"
                        r="20%"
                        cx="50%"
                        cy="150"
                        fill="#FFF"
                        stroke="black"
                        stroke-width="5"
                    />
                    
                </svg>
            `;
            //<text x="10" y="10" text-anchor="middle" font-size="24" fill="#000">${levelAmount}</text>
            level.innerHTML = svgLevel;
            const levelAmountDiv = document.createElement('div');
            levelAmountDiv.classList.add('levelAmountDiv');

            const levelAmountNbr = document.createElement('p');
            levelAmountNbr.classList.add('levelAmountNbr');
            levelAmountNbr.innerHTML = `${levelAmount}<br>Level`;
            levelAmountDiv.appendChild(levelAmountNbr);
            level.appendChild(levelAmountDiv);
            //--- End Create Level

            //--- Start Create Ratio
            ratioContent.innerHTML = `
                <svg>
                    <text x="150" y="30" fill="white" font-size="30" font-weight="bold" text-anchor="middle">
                        Audits ratio
                    </text>
                    <!-- Green Bar (Dynamic) -->
                    <rect id="green-bar" x="20" y="50" width="200" height="20" fill="green"></rect>

                    <!-- Red Bar (Dynamic) -->
                    <rect id="red-bar" x="20" y="100" width="220" height="20" fill="red"></rect>

                    <!-- Labels -->
                    <text x="130" y="66" fill="white" font-size="18" font-weight="bold"> 
                        <tspan id="green-value"></tspan> ↑
                    </text>
                    <text x="130" y="116" fill="white" font-size="18" font-weight="bold"> 
                        <tspan id="red-value"></tspan> ↓
                    </text>

                    <!-- Ratio Number -->
                    <text x="20" y="150" fill="white" font-size="30" font-weight="bold">
                        <tspan id="ratio-value">0.9</tspan>
                    </text>
                </svg>
            `;

            // setTimeout(() => updateGraphRatio(800, 120) , 3000);


            //--- End Create Ratio

            //--- Start display projects
            const listProjects = results.data.porjects;

            projects.innerHTML = `
                <svg id="chart" width="100%">
                    <!-- Title -->
                    <text x="50%" y="20" fill="white" font-size="30" font-weight="bold" text-anchor="middle">
                        Project Audits
                    </text>
                </svg>
            `;
            generateChart(listProjects);

            //--- End display projects

            //--- Start Best Skills
            bestSkills.innerHTML = `
                <svg id="chartSkills" width="100%">
                    <!-- Title -->
                    <text x="50%" y="20" fill="white" font-size="30" font-weight="bold" text-anchor="middle">
                        Best Skills
                    </text>
                </svg>
            `;
            const skills = results.data.skills;
            generateSkillChart(skills)


            //--- End Best Skills
        });



}

//------- End Home -----//

function updateGraphRatio(greenCounter, redCounter) {
    let maxWidth = 250;
    let maxVal = Math.max(greenCounter, redCounter);

    let greenWidth = (greenCounter / maxVal) * maxWidth;
    let redWidth = (redCounter / maxVal) * maxWidth;

    // Update bar widths
    document.getElementById("green-bar").setAttribute("width", greenWidth);
    document.getElementById("red-bar").setAttribute("width", redWidth);

    // Update text values
    document.getElementById("green-value").textContent = formatNumber(greenCounter);
    document.getElementById("red-value").textContent = formatNumber(redCounter);

    // Update ratio
    let ratio = (greenCounter / redCounter).toFixed(1);
    document.getElementById("ratio-value").textContent = ratio + " Ratio";

}

function formatNumber(num) {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + "M";
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(2) + "K";
    }
    return num
}

function generateChart(listProjects) {
    // const listProjects = results.data.porjects;
    const svg = document.getElementById("chart");
    let maxAmount = Math.max(...listProjects.map(prj => prj.amount)); // Get max value
    let maxWidth = 300; // Max width for bars
    let startY = 50; // Initial Y position
    let barHeight = 20;
    let barSpacing = 30; // Space between bars

    let padding = 50; // Space for title & extra spacing

    // Calculate required height dynamically
    let requiredHeight = listProjects.length * barSpacing + padding;
    svg.setAttribute("height", requiredHeight); // Set dynamic height

    listProjects.forEach((prj, index) => {
        let barWidth = (prj.amount / maxAmount) * maxWidth; // Scale bar width

        // Create bar
        let bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        // bar.setAttribute("x", 50);
        bar.setAttribute("x", 200);
        bar.setAttribute("y", startY + index * barSpacing);
        bar.setAttribute("width", barWidth + 200);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", "green");
        svg.appendChild(bar);

        // Add project name
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 10);
        text.setAttribute("y", startY + index * barSpacing + barHeight / 1.5);
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "20");
        text.textContent = formatChar(prj.path);
        svg.appendChild(text);

        // Add amount label
        let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        // label.setAttribute("x", barWidth + 60);
        label.setAttribute("x", barWidth + 420);
        label.setAttribute("y", startY + index * barSpacing + barHeight / 1.5);
        label.setAttribute("fill", "white");
        label.setAttribute("font-size", "20");
        label.textContent = formatNumber(prj.amount);
        svg.appendChild(label);
    });
}

function formatChar(path) {
    return path.split(`/oujda/module/`).pop();
}

/* Best Skills */
function generateSkillChart(skills) {
    const skillData = aggregateSkills(skills);
    const svg = document.getElementById("chartSkills");

    // Constants
    const chartWidth = 600;
    const chartHeight = 300;
    const barWidth = 30;
    const barSpacing = 10;
    const maxBarHeight = 200; // Max height for the tallest bar
    const maxValue = skillData[0][1]; // Get max value to scale bars

    // Set SVG size dynamically
    svg.setAttribute("width", chartWidth);
    svg.setAttribute("height", chartHeight + 50);

    // Generate bars
    skillData.forEach((skill, index) => {
        let skillName = skill[0];
        let skillValue = skill[1];

        let barHeight = (skillValue / maxValue) * maxBarHeight;
        let x = index * (barWidth + barSpacing);
        let y = chartHeight - barHeight;

        // Create bar
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "white");
        svg.appendChild(rect);

        // Add skill label
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + barWidth / 2);
        text.setAttribute("y", chartHeight + 15);
        text.setAttribute("fill", "white");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "10");
        text.textContent = skillName;
        svg.appendChild(text);

        // Add value label
        let valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", x + barWidth / 2);
        valueText.setAttribute("y", y - 5);
        valueText.setAttribute("fill", "white");
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("font-size", "10");
        valueText.textContent = skillValue + "%";
        svg.appendChild(valueText);
    });
}

function aggregateSkills(skills) {
    let skillMap = {};

    skills.forEach(skill => {
        skill.transactions.forEach(tx => {
            let skillName = tx.type.replace("skill_", ""); // Remove "skill_" prefix
            if (!skillMap[skillName]) {
                skillMap[skillName] = 0;
            }
            skillMap[skillName] += tx.amount;
        });
    });

    return Object.entries(skillMap)
        .sort((a, b) => b[1] - a[1]); // Sort by amount (descending)
}
