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
