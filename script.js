
var deletedStudents = [];

function addStudent() {
    var studentNameInput = document.getElementById("studentName");
    var studentName = studentNameInput.value;

    if (studentName === "") {
        return;
    }

    var studentList = document.getElementById("studentList");
    var button = document.createElement("student-button");
    button.textContent = studentName;
    button.onclick = function () {
        deleteStudent(button);
    };
    studentList.appendChild(button);

    studentNameInput.value = "";
}

function deleteStudent(button) {
    var studentList = document.getElementById("studentList");
    studentList.removeChild(button);
    deletedStudents.push(button);
}

function undoDelete() {
    if (deletedStudents.length > 0) {
        var studentList = document.getElementById("studentList");
        var buttonToRestore = deletedStudents.pop();
        studentList.appendChild(buttonToRestore);
    }
}

function loadFile() {
    initialize(); // 초기화 동작 추가

    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var names = e.target.result.split('\n');
            var gameDescription = document.getElementById("gameDescription");

            if (names.length > 0) {
                // Use the file name as the game description (removing the date part)
                var fileName = file.name.replace(/_\d{4}-\d{2}-\d{2}/, "").replace(".txt", "").trim();
                gameDescription.value = fileName;
            }

            names.forEach(function(name) {
                if (name.trim() !== "") {
                    var studentList = document.getElementById("studentList");
                    var button = document.createElement("student-button");
                    button.textContent = name.trim();
                    button.onclick = function () {
                        deleteStudent(button);
                    };
                    studentList.appendChild(button);
                }
            });
        };
        reader.readAsText(file);
    }
}

function exportToTextFile() {
    var gameDescription = document.getElementById("gameDescription").value;
    var studentList = document.getElementById("studentList");
    var buttons = studentList.getElementsByTagName("student-button");
    var studentNames = [];
    for (var i = 0; i < buttons.length; i++) {
        studentNames.push(buttons[i].textContent);
    }

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    var dateString = year + '-' + month + '-' + day;

    var text = studentNames.join("\n");
    var blob = new Blob([text], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = gameDescription + "_" + dateString + ".txt"; // 한국 시간에 맞게 파일 이름 생성
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function initialize() {
    // 초기화 동작 추가
    var gameDescription = document.getElementById("gameDescription");
    gameDescription.value = "";
    var studentList = document.getElementById("studentList");
    studentList.innerHTML = "";
}

function updateTitle() {
    var gameDescription = document.getElementById("gameDescription").value;
    document.title = gameDescription;
}

function openNewTab() {
    // 현재 페이지 URL을 가져와서 새 탭에서 열기
    var currentURL = window.location.href;
    window.open(currentURL, '_blank');
}

