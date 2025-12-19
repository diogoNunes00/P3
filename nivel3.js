const slots = document.querySelectorAll('.slot');
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', card.id || card.getAttribute('data-id')));
});

slots.forEach(slot => {
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const el = document.querySelector(`[data-id="${id}"], #${id}`);

        if (el.classList.contains('fundo')) {
            const imgPath = el.getAttribute('data-img');
            slot.style.backgroundImage = `url('${imgPath}')`;
            slot.setAttribute('data-fundo-colocado', id); // Marca qual fundo está lá
        } else {
            const novoImg = el.querySelector('img').cloneNode();
            novoImg.setAttribute('data-tipo', el.getAttribute('data-tipo')); // Passa a marca para o clone
            novoImg.onclick = function() { this.remove(); avaliarCena(); };
            slot.querySelector('.slot-content').appendChild(novoImg);
        }
        avaliarCena();
    });
});

function avaliarCena() {
    const s1 = document.getElementById('slot1');
    const s2 = document.getElementById('slot2');
    const s3 = document.getElementById('slot3');

    const tem = (slot, tipo) => Array.from(slot.querySelectorAll('img')).some(i => i.getAttribute('data-tipo') === tipo);
    const fundo = (slot, idFundo) => slot.getAttribute('data-fundo-colocado') === idFundo;

    // CONDIÇÃO RIGOROSA DA TUA IMAGEM
    const v1 = fundo(s1, 'sala') && tem(s1, 'morto') && (tem(s1, 'policia') || tem(s1, 'detetive'));
    const v2 = fundo(s2, 'cozinha1') && tem(s2, 'mary') && tem(s2, 'perna');
    const v3 = fundo(s3, 'cozinha3') && tem(s3, 'mary') && tem(s3, 'perna') && tem(s3, 'policia');

    if (v1 && v2 && v3) {
        document.getElementById('tituloFinal').textContent = "✅ Mistério Resolvido!";
        document.getElementById('descricaoFinal').textContent = "Mary conseguiu o álibi perfeito.";
        document.getElementById('popup').style.display = 'flex';
    }
}