document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('linkForm');
    const output = document.getElementById('output');
    const linksTableBody = document.querySelector('#linksTable tbody');

    const generateRandomAlias = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const saveLink = (alias, longUrl) => {
        let links = JSON.parse(localStorage.getItem('links') || '[]');
        links = links.filter(link => link.alias !== alias); // Remove duplicate if exists
        links.push({ alias, longUrl, createdAt: new Date().toISOString() });
        if (links.length > 10) links.shift(); // Keep only last 10
        localStorage.setItem('links', JSON.stringify(links));
    };

    const loadLinks = () => {
        const links = JSON.parse(localStorage.getItem('links') || '[]');
        linksTableBody.innerHTML = links.map(link => `
            <tr>
                <td><a href="${window.location.origin}/${link.alias}">${window.location.origin}/${link.alias}</a></td>
                <td>${link.longUrl}</td>
                <td><button class="copy-btn" data-link="${window.location.origin}/${link.alias}">KOPIUJ</button></td>
            </tr>
        `).join('');
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const longUrl = document.getElementById('longUrl').value;
        let alias = document.getElementById('alias').value;

        if (!alias) alias = generateRandomAlias();
        
        saveLink(alias, longUrl);
        loadLinks();
        output.innerHTML = `<p>Skrócony link: <a href="${window.location.origin}/${alias}">${window.location.origin}/${alias}</a></p>`;
        form.reset();
    });

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const link = e.target.getAttribute('data-link');
            navigator.clipboard.writeText(link);
            alert('Link skopiowany: ' + link);
        }
    });

    loadLinks();
});
