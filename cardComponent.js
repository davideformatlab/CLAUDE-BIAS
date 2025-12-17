// Funzione che genera l'HTML di una singola card
export function createCardHTML(item) {
    return `
        <article class="card" id="card-${item.id}">
            <div class="card-header">
                <span class="card-icon">${item.icon}</span>
                <h3>${item.title}</h3>
            </div>
            <div class="card-body">
                <p class="card-desc">${item.description}</p>
            </div>
            <div class="advice-box">
                <span class="advice-label">Il Consiglio</span>
                <p class="advice-text">${item.advice}</p>
            </div>
        </article>
    `;
}