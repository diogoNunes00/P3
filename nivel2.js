const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const popup = document.getElementById('popup');
const btnAvancar = document.getElementById('btnAvancar');

// 1. LÓGICA DE DRAG & DROP
cards.forEach(card => {
    card.addEventListener('dragstart', e => {
        const usos = parseInt(card.getAttribute('data-uso') || "999");
        if (usos <= 0) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', card.id);
    });
});

slots.forEach(slot => {
    slot.addEventListener('dragover', e => e.preventDefault());

    slot.addEventListener('drop', e => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const originalCard = document.getElementById(cardId);
        if (!originalCard) return;

        if (originalCard.classList.contains('fundo')) {
            const imgPath = originalCard.getAttribute('data-img');
            slot.style.backgroundImage = `url('${imgPath}')`;
            slot.setAttribute('data-fundo-atual', imgPath); // Para facilitar a verificação
        } else {
            const clone = originalCard.cloneNode(true);
            clone.removeAttribute('id');
            clone.addEventListener('click', () => { clone.remove(); avaliarCena(); });
            slot.querySelector('.slot-content').appendChild(clone);
        }

        atualizarContador(originalCard);
        avaliarCena();
    });
});

function atualizarContador(card) {
    let usos = parseInt(card.getAttribute('data-uso'));
    if (isNaN(usos)) return;
    usos--;
    card.setAttribute('data-uso', usos);
    if (usos <= 0) card.classList.add('esgotado');
}

// 2. VALIDAÇÃO DA SOLUÇÃO (Exatamente como na imagem)
function avaliarCena() {
    const s1 = document.getElementById('slot1');
    const s2 = document.getElementById('slot2');
    const s3 = document.getElementById('slot3');

    const temPeca = (slot, alt) => {
        return Array.from(slot.querySelectorAll('img')).some(i => i.alt.toLowerCase() === alt.toLowerCase());
    };

    const temFundo = (slot, nome) => {
        const bg = slot.style.backgroundImage || "";
        return bg.toLowerCase().includes(nome.toLowerCase());
    };

    const contarPecas = (slot) => slot.querySelectorAll('img').length;

    // CONDIÇÕES DA VITÓRIA
    // Slot 1: Sala + Marido Morto
    const v1 = temFundo(s1, 'Sala.png') && temPeca(s1, 'Marido Morto') && contarPecas(s1) === 1;

    // Slot 2: Cozinha + Mary + Perna
    const v2 = temFundo(s2, 'Cozinha2.png') && temPeca(s2, 'Mary') && temPeca(s2, 'Perna') && contarPecas(s2) === 2;

    // Slot 3: Mercearia + Mary
    const v3 = temFundo(s3, 'Mercearia.png') && temPeca(s3, 'Mary') && contarPecas(s3) === 1;

    // Verificação para acionar o Pop-up
    const todosFundos = temFundo(s1, '.') && temFundo(s2, '.') && temFundo(s3, '.');
    const totalPecas = document.querySelectorAll('.slot-content img').length;

    if (v1 && v2 && v3) {
        exibirFeedback(true, "✅ Álibi Perfeito!", "Mary organizou a cena e garantiu que o lojista a visse. O crime está oculto.");
    } else if (todosFundos && totalPecas >= 4) {
        // Se os slots estão cheios e tem as 4 peças necessárias, mas não acertou a combinação
        exibirFeedback(false, "❌ Algo está errado", "Esta disposição não cria um álibi convincente.");
    }
}

function exibirFeedback(sucesso, titulo, desc) {
    document.getElementById('tituloFinal').textContent = titulo;
    document.getElementById('descricaoFinal').textContent = desc;
    btnAvancar.style.display = sucesso ? 'inline-block' : 'none';
    popup.style.display = 'flex';
    if (!sucesso) document.body.classList.add('error-bg');
    else document.body.classList.remove('error-bg');
}

btnAvancar.addEventListener('click', () => { window.location.href = 'nivel3.html'; });