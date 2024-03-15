// Display content of a file
function displayFileContent(file) {
    var fileIndex = fileData.findIndex(f => f.file === file);
    var fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';

    // 아코디언 형태로 UI 변경?
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
        var items = e.target.result.split('\n');
        fileData[fileIndex].originalContent = items.slice();
        items.forEach(function (item) {
            var itemButton = createItemButton(item, fileIndex);
            contentButtons.appendChild(itemButton);
        });
    };
    reader.readAsText(file);
    return contentButtons;
}

// Create a container for each line of the file
function createItemButton(item, fileIndex) {
    var itemContainer = document.createElement('div');
    itemContainer.style.display = 'flex'; // flex 레이아웃 사용

    var dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.className = 'drag-handle';

    var button = document.createElement('button');
    button.textContent = item;
    button.className = 'item-button'; // CSS 클래스 추가
    button.onclick = function () {
        fileData[fileIndex].removedButtons.push({ element: itemContainer, index: fileData[fileIndex].originalContent.indexOf(item) });
        itemContainer.remove();
    };

    itemContainer.appendChild(dragHandle);
    itemContainer.appendChild(button);
    return itemContainer;
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
    
    // 버튼 정보 배열을 순회하며 각 버튼을 생성하고, 이벤트 핸들러를 바인딩
    buttonsInfo.forEach(function(buttonInfo) {
        var button = createIconButton(buttonInfo.icon, buttonInfo.label);
        button.onclick = buttonInfo.onClick;
        iconButtonContainer.appendChild(button);
    });

    return iconButtonContainer;
}
