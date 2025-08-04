document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const converter = new showdown.Converter();

    // --- הגדרות GitHub ---
    // !!! יש לעדכן את הפרטים הבאים !!!
    const githubUser = 'AMAARETS'; // החלף בשם המשתמש שלך בגיטהאב
    const githubRepo = 'AutoKal'; // החלף בשם הפרויקט (repository) שלך
    const pathToLinks = 'links'; // הנתיב לתיקיית קבצי ה-MD בפרויקט

    // בניית כתובת ה-API לקבלת תוכן התיקייה
    const apiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${pathToLinks}`;

    // קריאה ל-API של GitHub כדי לקבל את רשימת הקבצים
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`שגיאת רשת: ${response.statusText}`);
            }
            return response.json();
        })
        .then(files => {
            // סינון הרשימה כדי לכלול רק קבצים שמסתיימים ב-.md
            const mdFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.md'));

            mdFiles.forEach(file => {
                const postName = file.name.replace('.md', '');

                // קריאת תוכן הקובץ באמצעות ה-download_url שלו
                fetch(file.download_url)
                    .then(response => response.text())
                    .then(markdown => {
                        const postElement = document.createElement('article');
                        postElement.className = 'post';

                        const titleElement = document.createElement('h2');
                        const linkElement = document.createElement('a');
                        linkElement.href = `${postName}`;
                        linkElement.textContent = postName.replace(/_/g, ' ');
                        titleElement.appendChild(linkElement);

                        const contentElement = document.createElement('div');
                        contentElement.innerHTML = converter.makeHtml(markdown);

                        postElement.appendChild(titleElement);
                        postElement.appendChild(contentElement);

                        postsContainer.appendChild(postElement);
                    })
                    .catch(error => console.error('Error fetching markdown content:', error));
            });
        })
        .catch(error => {
            console.error('Error fetching file list from GitHub:', error);
            postsContainer.innerHTML = `<p style="color: red; text-align: center;">לא ניתן היה לטעון את רשימת הפוסטים מ-GitHub. ודא שהפרטים שהזנת נכונים ושהפרויקט ציבורי.</p>`;
        });
});
