document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const converter = new showdown.Converter();

    // קריאת רשימת הקבצים מהקובץ files.json
    fetch('links/files.json')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                // קבלת שם הקובץ ללא הסיומת
                const postName = file.replace('.md', '');

                // קריאת תוכן הקובץ
                fetch(`links/${file}`)
                    .then(response => response.text())
                    .then(markdown => {
                        // יצירת אלמנט חדש לפוסט
                        const postElement = document.createElement('article');
                        postElement.className = 'post';

                        // יצירת כותרת עם קישור
                        const titleElement = document.createElement('h2');
                        const linkElement = document.createElement('a');
                        linkElement.href = `${postName}.html`; // קישור לדף פנימי
                        linkElement.textContent = postName.replace(/_/g, ' '); // החלפת קו תחתון ברווח
                        titleElement.appendChild(linkElement);

                        // יצירת תוכן הפוסט
                        const contentElement = document.createElement('div');
                        contentElement.innerHTML = converter.makeHtml(markdown);

                        // הוספת הכותרת והתוכן לפוסט
                        postElement.appendChild(titleElement);
                        postElement.appendChild(contentElement);

                        // הוספת הפוסט לקונטיינר
                        postsContainer.appendChild(postElement);
                    })
                    .catch(error => console.error('Error fetching markdown file:', error));
            });
        })
        .catch(error => console.error('Error fetching file list:', error));
});
