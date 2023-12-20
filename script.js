$(document).ready(function () {
    // 사이드바와 콘텐츠에 'active' 클래스 추가하여 시작 시 사이드바를 활성화
    $('#sidebar, #content').addClass('active');
    var sidebarWidth = $('#sidebar').width();
    $('#content').css('margin-left', sidebarWidth + 'px');
    $('#sidebarCollapse').css('left', sidebarWidth + 37 + 'px');
    $('#toggleIcon').removeClass('fa-arrow-right').addClass('fa-arrow-left');

    // Toggle sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        var sidebarWidth = $('#sidebar').width();
        if ($('#sidebar').hasClass('active')) {
            $('#content').css('margin-left', sidebarWidth + 'px');
            $('#sidebarCollapse').css('left', sidebarWidth + 37 + 'px');
            $('#toggleIcon').removeClass('fa-arrow-right').addClass('fa-arrow-left');
        } else {
            $('#content').css('margin-left', '0');
            $('#sidebarCollapse').css('left', '0');
            $('#toggleIcon').removeClass('fa-arrow-left').addClass('fa-arrow-right');
        }
    });

    // File input change event
    document.getElementById('fileInput').addEventListener('change', function (event) {
        Array.from(event.target.files).forEach(function (file) {
            fileData.push({ file: file, lines: [], originalContent: [], removedButtons: [] });
            var fileButton = createFileButton(file);
            document.getElementById('fileButtons').appendChild(fileButton);
        });
    });

    // Initialize sortable container
    $("#fileContentsContainer").sortable();

    // Check if fileContentsContainer is empty and display a message if it is
    checkFileContentsContainer();

    // 데모 파일 데이터 생성
    var demoFile = {
        name: "데모 파일",
        content: "여기에\n데모 파일의\n내용을\n채워넣으세요."
    };

    // 데모 버튼 생성 및 추가
    var demoButton = createFileButton(demoFile);
    document.getElementById('sidebar').appendChild(demoButton);
});

// Global file data array
var fileData = [];

// Function to load a page into the main content
function loadPage(url) {
    $('#main-content').load(url);
}

// Function to check if fileContentsContainer is empty and display a message
function checkFileContentsContainer() {
    var container = $("#fileContentsContainer");
    if (container.children().length === 0) {
        var emptyMessage = $('<div/>', {
            id: 'emptyContainerMessage',
            text: '누가 누가 안 했나 for Web'
        });

        container.append(emptyMessage);
    } else {
        $('#emptyContainerMessage').remove();
    }
}

function createFileButton(file) {
    var button = document.createElement('button');
    var fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    var icon = document.createElement('i');
    icon.className = 'fas fa-file-alt';

    var textSpan = document.createElement('span');
    textSpan.textContent = fileNameWithoutExtension;

    button.appendChild(icon);
    button.appendChild(textSpan);

    button.onclick = function () {
        displayFileContent(file);
    };

    button.classList.add('file-list-button');

    return button;
}

// Display content of a file or demo file
function displayFileContent(file) {
    var fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';

    var fileDetails = createFileDetails(file);
    fileContentDiv.appendChild(fileDetails);

    var contentButtons = document.createElement('div');
    contentButtons.className = 'content-buttons';
    fileContentDiv.appendChild(contentButtons);

    var fileContent;
    if (file.content) {
        // 데모 파일의 경우
        fileContent = file.content.split('\n');
    } else {
        // 실제 파일의 경우
        var reader = new FileReader();
        reader.onload = function (e) {
            fileContent = e.target.result.split('\n');
            fileContent.forEach(function (line) {
                var lineContainer = createLineContainer(line);
                contentButtons.appendChild(lineContainer);
            });
        };
        reader.readAsText(file);
        return; // FileReader가 비동기적으로 작동하므로, 여기서 함수 실행을 종료합니다.
    }

    // 데모 파일의 내용을 처리
    fileContent.forEach(function (line) {
        var lineContainer = createLineContainer(line);
        contentButtons.appendChild(lineContainer);
    });

    document.getElementById('fileContentsContainer').appendChild(fileContentDiv);
    checkFileContentsContainer(); // Check and update message after adding content
}

// 아이콘 버튼 컨테이너를 생성하고 반환하는 함수
function createIconButtonContainer(fileIndex, contentButtons) {
    var iconButtonContainer = document.createElement('div');
    iconButtonContainer.className = 'icon-button-container';

    // 내용 추가 버튼
    var addButton = createIconButton('fa-plus', '내용 추가');
    addButton.onclick = function () {
        addContent(fileIndex, contentButtons);
    };
    iconButtonContainer.appendChild(addButton);

    // 되돌리기 버튼
    var undoButton = createIconButton('fa-undo-alt', '되돌리기');
    undoButton.onclick = function () {
        undoRemove(fileIndex, contentButtons);
    };
    iconButtonContainer.appendChild(undoButton);

    // 내보내기 버튼
    var exportButton = createIconButton('fa-file-export', '내보내기');
    exportButton.onclick = function () {
        exportToFile(contentButtons, fileData[fileIndex].file.name, fileIndex);
    };
    iconButtonContainer.appendChild(exportButton);

    // 삭제 버튼
    var deleteButton = createIconButton('fa-trash', '이 복사본 삭제');
    deleteButton.onclick = function () {
        // `deleteButton`의 상위 요소를 찾아서 삭제
        var fileContentDiv = this.closest('.file-content');
        if (fileContentDiv) {
            fileContentDiv.remove();
        }
        checkFileContentsContainer(); // Check and update message after adding content
    };
    iconButtonContainer.appendChild(deleteButton);

    return iconButtonContainer;
}

// Create an icon button
function createIconButton(iconClass, title) {
    var button = document.createElement('button');
    button.classList.add('icon-button'); // 여기에 클래스 추가
    var icon = document.createElement('i');
    icon.className = 'fas ' + iconClass;
    button.appendChild(icon);
    button.title = title; // Tooltip
    return button;
}

// Create file details display with text input for editing file name
function createFileDetails(file, fileIndex) {
    var fileInputDiv = document.createElement('div');
    fileInputDiv.className = 'file-input'; 

    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = file.name; 
    textInput.className = 'file-name-input'; 

    textInput.addEventListener('change', function() {
        if (fileData[fileIndex]) {
            fileData[fileIndex].customFileName = this.value;
        }
    });

    fileInputDiv.appendChild(textInput);
    return fileInputDiv;
}
// Create buttons for content manipulation
function createContentButtons(file, fileIndex) {
    var contentButtons = document.createElement('div');
    contentButtons.style.display = 'flex';
    contentButtons.style.flexDirection = 'row'; // 수평 배열을 위해 row로 설정
    contentButtons.style.flexWrap = 'wrap'; // 내용이 많을 경우 다음 줄로 넘김

    var reader = new FileReader();
    reader.onload = function (e) {
        var lines = e.target.result.split('\n');
        fileData[fileIndex].originalContent = lines.slice();
        lines.forEach(function (line) {
            var lineContainer = createLineContainer(line, fileIndex);
            contentButtons.appendChild(lineContainer);
        });
    };
    reader.readAsText(file);
    return contentButtons;
}

// Create a container for each line of the file
function createLineContainer(line, fileIndex) {
    var lineContainer = document.createElement('div');
    lineContainer.style.display = 'flex'; // flex 레이아웃 사용

    var dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.className = 'drag-handle';

    var button = document.createElement('button');
    button.textContent = line;
    button.className = 'line-button'; // CSS 클래스 추가
    button.onclick = function () {
        fileData[fileIndex].removedButtons.push({ element: lineContainer, index: fileData[fileIndex].originalContent.indexOf(line) });
        lineContainer.remove();
    };

    lineContainer.appendChild(dragHandle);
    lineContainer.appendChild(button);
    return lineContainer;
}

// Undo the last remove action
function undoRemove(fileIndex, contentButtons) {
    var lastRemoved = fileData[fileIndex].removedButtons.pop();
    if (lastRemoved) {
        var lineContainer = lastRemoved.element;
        contentButtons.appendChild(lineContainer);
    }
}

// Export modified content to a file
function exportToFile(contentButtons, defaultFileName, fileIndex) {
    var customFileName = fileData[fileIndex].customFileName || defaultFileName;

    // 파일 이름에 확장자가 없으면 '.txt'를 추가
    if (!customFileName.endsWith('.txt')) {
        customFileName += '.txt';
    }

    var lines = [];
    for (var i = 0; i < contentButtons.children.length; i++) {
        var lineContainer = contentButtons.children[i];
        lines.push(lineContainer.querySelector('button').textContent);
    }
    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = customFileName;
    a.click();
    URL.revokeObjectURL(url);
}

// Add new content to a file
function addContent(fileIndex, contentButtons) {
    var newContent = prompt('추가할 내용을 입력하세요:');
    if (newContent) {
        var lineContainer = createLineContainer(newContent, fileIndex);
        contentButtons.appendChild(lineContainer);
        fileData[fileIndex].originalContent.push(newContent);
    }
}

function downloadFile(filename, content) {
    var blob = new Blob([content], {type: "text/plain"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
