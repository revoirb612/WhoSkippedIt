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
    }
}

function setupFileInputChangeEvent() {
    document.getElementById('fileInput').addEventListener('change', function (event) {
        Array.from(event.target.files).forEach(async function (file) {
            const fileDataToStore = {
                name: file.name,
                type: file.type,
                size: file.size,
                content: null, // 이전 예제와 같이 파일 내용을 여기에 저장할 수 있습니다.
                file: file, // 파일 객체 자체를 저장합니다.
                lines: [],
                originalContent: [],
                removedButtons: []
            };

            // IndexedDB에 파일 정보와 파일 객체를 저장합니다.
            await db.files.add(fileDataToStore);
        });        
        
        Array.from(event.target.files).forEach(function (file) {
            fileData.push({ file: file, lines: [], originalContent: [], removedButtons: [] });
            var fileButton = createFileButton(file);
            document.getElementById('fileButtons').appendChild(fileButton);
        });
    });
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
