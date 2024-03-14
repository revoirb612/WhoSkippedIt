// Global file data array
var fileData = [];

$(document).ready(function () {
    toggleSidebar();

    $('#sidebarCollapse').on('click', function () {
        toggleSidebar();
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
});

function toggleSidebar() {
    var sidebarWidth = $('#sidebar').width();

    // 사이드바와 콘텐츠의 'active' 클래스 토글
    $('#sidebar, #content').toggleClass('active');

    // 사이드바의 너비에 따라 콘텐츠와 버튼의 위치 조절
    if ($('#sidebar').hasClass('active')) {
        $('#content').css('margin-left', sidebarWidth + 'px');
        $('#sidebarCollapse').css('left', sidebarWidth + 37 + 'px');
        $('#toggleIcon').removeClass('fa-arrow-right').addClass('fa-arrow-left');
    } else {
        $('#content').css('margin-left', '0');
        $('#sidebarCollapse').css('left', '0');
        $('#toggleIcon').removeClass('fa-arrow-left').addClass('fa-arrow-right');
        window.uploadData();  // 사이드바 비활성화 시 데이터 업로드
    }
}

// Function to load a page into the main content
function loadPage(url) {
    $('#main-content').load(url);
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

// Display content of a file
function displayFileContent(file) {
    var fileIndex = fileData.findIndex(f => f.file === file);
    var fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';

    var fileDetails = createFileDetails(file, fileIndex);
    fileContentDiv.appendChild(fileDetails);

    var contentButtons = createContentButtons(file, fileIndex);
    contentButtons.className = 'content-buttons';
    fileContentDiv.appendChild(contentButtons);

    $(contentButtons).sortable({
        handle: '.drag-handle'
    });

    var iconButtonContainer = createIconButtonContainer(fileIndex, contentButtons);
    fileContentDiv.appendChild(iconButtonContainer);

    document.getElementById('fileContentsContainer').appendChild(fileContentDiv);
    checkFileContentsContainer(); // Check and update message after adding content
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

function addContent(fileIndex, contentButtons) {
    var newContent = prompt('추가할 내용을 입력하세요:');
    if (newContent) {
        var lineContainer = createLineContainer(newContent, fileIndex);
        contentButtons.appendChild(lineContainer);
        fileData[fileIndex].originalContent.push(newContent);
    }
}

function undoRemove(fileIndex, contentButtons) {
    var lastRemoved = fileData[fileIndex].removedButtons.pop();
    if (lastRemoved) {
        var lineContainer = lastRemoved.element;
        contentButtons.appendChild(lineContainer);
    }
}

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

function deleteFileContent() {
    var fileContentDiv = this.closest('.file-content');
    if (fileContentDiv) {
        fileContentDiv.remove();
    }
    checkFileContentsContainer();
}

function createIconButtonContainer(fileIndex, contentButtons) {
    var iconButtonContainer = document.createElement('div');
    iconButtonContainer.className = 'icon-button-container';

    // 버튼 정보 및 클릭 이벤트 핸들러를 배열로 정의
    var buttonsInfo = [
        {icon: 'fa-plus', label: '내용 추가', onClick: () => addContent(fileIndex, contentButtons)},
        {icon: 'fa-undo-alt', label: '되돌리기', onClick: () => undoRemove(fileIndex, contentButtons)},
        {icon: 'fa-file-export', label: '내보내기', onClick: () => exportToFile(contentButtons, fileData[fileIndex].file.name, fileIndex)},
        {icon: 'fa-trash', label: '이 복사본 삭제', onClick: deleteFileContent}
    ];

    // 버튼 정보 배열을 순회하며 각 버튼을 생성하고, 이벤트 핸들러를 바인딩
    buttonsInfo.forEach(function(buttonInfo) {
        var button = createIconButton(buttonInfo.icon, buttonInfo.label);
        button.onclick = buttonInfo.onClick;
        iconButtonContainer.appendChild(button);
    });

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
