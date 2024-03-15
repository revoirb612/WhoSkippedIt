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
        var items = e.target.result.split('\n');
        fileData[fileIndex].originalContent = items.slice();
        itmes.forEach(function (item) {
            var itemContainer = createItemContainer(item, fileIndex);
            contentButtons.appendChild(itemContainer);
        });
    };
    reader.readAsText(file);
    return contentButtons;
}

// Create a container for each line of the file
function createItemContainer(item, fileIndex) {
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
