// ---------- Base popup ----------
function createPopup(title, content) {
    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    // Popup
    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
        <button class="popup-close">✕</button>
        <h2>${title}</h2>
        <div class="popup-content">${content}</div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Fermeture
    overlay.querySelector(".popup-close").onclick = (e) => {
        e.stopPropagation();
        closePopup(overlay);
    };
    
    overlay.onclick = (e) => {
        e.stopPropagation();
        if (e.target === overlay) {
            closePopup(overlay);
        }
    };
}

function closePopup(overlay) {
    overlay.remove();
    window.dispatchEvent(new Event("popup:closed"));
}

// ---------- Popups par catégorie ----------
export function showCVPopup(mesh) {
    createPopup(
        "Curriculum Vitae",
        `
        <p><strong>Objet :</strong> ${mesh.name}</p>
        <p>Présentation de mon parcours, compétences et expériences.</p>
        <a href="/cv.pdf" target="_blank">Télécharger le CV</a>
        `
    );
}

export function showProjectPopup(mesh) {
    createPopup(
        "Projet",
        `
        <p><strong>Projet :</strong> ${mesh.name}</p>
        <p>Description du projet, stack technique, objectifs.</p>
        <button>Lancer la démo</button>
        `
    );
}

export function showPassionPopup(mesh) {
    createPopup(
        "Passion",
        `
        <p><strong>Passion :</strong> ${mesh.name}</p>
        <p>IA, 3D, neurosciences, exploration créative.</p>
        `
    );
}

export function showDegreePopup(mesh) {
    createPopup(
        "Diplôme",
        `
        <p><strong>Diplôme :</strong> ${mesh.name}</p>
        <p>Formations, certifications, établissements.</p>
        `
    );
}
