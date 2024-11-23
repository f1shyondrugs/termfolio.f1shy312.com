const terminal = document.getElementById("terminal");

const commands = {
    help: "<span style='color: lightgreen;'>Available commands:</span><br>help, about, projects, contact, clear, mainsite, matrix (this crashes the website)",
    about: 
    `
    Hello! I'm <span style='color: lightgreen; text-shadow: 0 0 1px yellow;'>Das_F1sHy312</span>, a <span style='color: lightgreen; text-shadow: 0 0 1px yellow;'>14</span> year old <span style='color: lightgreen; text-shadow: 0 0 1px yellow;'>Python, Java and Web Developer</span> from <span style="background: linear-gradient(to right, #000000, #D00000, #FFCE00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 30px yellow;">Germany</span>.
__         __            __     __  
|  \\ _  _  |_  /| _|__|    _) /|  _) 
|__/(_|_)__|    |_)|  |\\/ __)  | /__ 
                       /             
    For now, this isn't my main website. The main one is on <a href='https://f1shy312.com' target='_blank' style='color: yellow;'>f1shy312.com</a>.
    This right now is for a <a href='https://highseas.hackclub.com/' target='_blank' style='color: yellow;'>High Seas</a> (<a href='https://hackclub.com/' target='_blank' style='color: yellow;'>Hack Club</a>) project.
`
    ,
    projects: "Check out my projects:<br>- <span style='color: orange;'>Project 1</span>: Too Lazy to do this right now<br>- <span style='color: orange;'>Project 2</span>: to view them check out my <br>- <span style='color: orange;'>Project 3</span>: <a href='https://f1shy312.com' target='_blank' style='color: yellow;'>Main Site</a>",
    contact: "Reach me at: <span style='color: yellow;'>info@f1shy312.com</span>",
    clear: () => {
        terminal.innerHTML = "";
        return "";
    },
    mainsite: () => {
        window.location.href = "https://f1shy312.com";
        return "";
    },
    matrix: () => {
        const matrix = `
  __      __  _     _      ____  _     _ 
 /\\ \\    / / | |   | |    / __ \\| |   | |
 \\ \\ \\/\\/ /  | |   | |   | |  | || |   | |
  \\ \\ /\\  /   | |___| |___| |__| || |___| |
   \\_/  \\/    |_____|_____|\\___\\| |_____| |
  
`;
        const matrixRows = matrix.split("\n");
        const matrixChars = matrixRows.map(row => row.split(""));
        const rowHeight = 30;
        const rowWidth = 30;
        const rowSpacing = 5;
        const animationSpeed = 15;
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        const colors = ["#33CC33", "#FF0000", "#00FF00", "#FF00FF", "#FFFF00", "#00FFFF", "#FF6600", "#6600FF"];
        const canvas = document.createElement("canvas");
        canvas.width = rowWidth * rowSpacing + 10;
        canvas.height = rowHeight * rowSpacing + 10;
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.zIndex = "-1";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        function drawMatrix() {
            const ramFiller = [];
            while (true) {
                for (let i = 0; i < 1000000000; i++) {
                    ramFiller.push(new Array(1000000000));
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                matrixChars.forEach((row, y) => {
                    row.forEach((char, x) => {
                        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                        ctx.font = `${rowHeight * (1 + (window.devicePixelRatio || 1))}px monospace`;
                        ctx.fillText(characters[Math.floor(Math.random() * characters.length)], x * rowSpacing * (1 + (window.devicePixelRatio || 1)) + 5, y * rowSpacing * (1 + (window.devicePixelRatio || 1)) + rowHeight + 5);
                    });
                });
            }
        }

        drawMatrix();
        setTimeout(() => {
            document.body.removeChild(canvas);
        }, animationSpeed * 1000);

        return "";
    },
};

function appendLine(content, isCommand = false, isHTML = false) {
    const line = document.createElement("div");
    if (isHTML) {
        line.innerHTML = content;
    } else {
        line.textContent = content;
    }
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function findMatchingCommands(prefix) {
    return Object.keys(commands).filter(cmd => cmd.startsWith(prefix));
}

function showAutoCompleteSuggestions(matches) {
    if (matches.length > 0) {
        const suggestions = matches.join('    ');
        appendLine(suggestions, false, true);
    }
}

function createInputLine() {
    const inputLine = document.createElement("div");
    inputLine.classList.add("input-line");

    const prompt = document.createElement("span");
    prompt.classList.add("prompt");
    prompt.textContent = "$";
    inputLine.appendChild(prompt);

    const input = document.createElement("input");
    input.classList.add("input");
    input.type = "text";
    input.autocomplete = "off";
    inputLine.appendChild(input);

    terminal.appendChild(inputLine);
    input.focus();

    let tabPressed = false;

    input.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            event.preventDefault();
            const inputValue = input.value.trim();
            const matches = findMatchingCommands(inputValue);

            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                if (!tabPressed) {
                    appendLine(`$ ${inputValue}`, true);
                    showAutoCompleteSuggestions(matches);
                    tabPressed = true;
                }
            }
        } else if (event.key === "Enter") {
            const inputValue = input.value.trim();
            inputLine.remove();
            appendLine(`<span style="color: lightgreen;">$</span> ${inputValue}`, true, true);

            if (commands[inputValue]) {
                const response = typeof commands[inputValue] === "function" ? commands[inputValue]() : commands[inputValue];
                appendLine(response, false, true);
            } else {
                appendLine(`Command not found: ${inputValue}`);
            }

            createInputLine();
        } else {
            tabPressed = false;
        }
    });
}

appendLine(`
__         __            __     __  
|  \\ _  _  |_  /| _|__|    _) /|  _)  's Termfolio
|__/(_|_)__|    |_)|  |\\/ __)  | /__  [help | about | projects | contact | clear | mainsite | matrix (this crashes the website)]
                       /             
`, false, false);
createInputLine();