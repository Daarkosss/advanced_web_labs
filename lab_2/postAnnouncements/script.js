document.querySelector('#add_announcement').addEventListener('click', function() {
    const container = document.querySelector('#announcements');
    const newAnnouncement = document.createElement('div');
    newAnnouncement.classList.add('announcement');

    const textarea = document.createElement('textarea');
    textarea.name = 'announcements_content[]';
    textarea.classList.add('announcement-textarea');

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove_announcement');
    removeButton.addEventListener('click', function() {
        newAnnouncement.remove();
    });

    newAnnouncement.appendChild(textarea);
    newAnnouncement.appendChild(removeButton);
    container.appendChild(newAnnouncement);
});


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#announcements').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove_announcement')) {
            e.target.parentElement.remove();
        }
    });
});