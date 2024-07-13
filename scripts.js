let saldoAtual = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('saldoAtual')) {
        saldoAtual = parseFloat(localStorage.getItem('saldoAtual'));
        document.getElementById('saldoAtual').innerText = saldoAtual.toFixed(2);
    }
});

function atualizarSaldo() {
    const saldoInicial = document.getElementById('saldoInicial').value;
    saldoAtual = parseFloat(saldoInicial);
    document.getElementById('saldoAtual').innerText = saldoAtual.toFixed(2);
}

function adicionarGasto() {
    const motivo = document.getElementById('motivo').value;
    const valor = document.getElementById('valor').value;
    const data = document.getElementById('data').value;

    if (motivo && valor && data) {
        const gasto = parseFloat(valor);
        saldoAtual -= gasto;
        document.getElementById('saldoAtual').innerText = saldoAtual.toFixed(2);

        const historico = JSON.parse(localStorage.getItem('historico')) || [];
        historico.push({ data, motivo, valor: gasto });
        localStorage.setItem('historico', JSON.stringify(historico));

        mostrarNotificacao('Gasto registrado com sucesso!', 'success');

        // Limpar os campos de entrada
        document.getElementById('motivo').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('data').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function salvarDados() {
    localStorage.setItem('saldoAtual', saldoAtual.toFixed(2));
    mostrarNotificacao('Dados salvos com sucesso!', 'success');
}

function mostrarNotificacao(mensagem, tipo) {
    const notificacao = document.createElement('div');
    notificacao.classList.add('notificacao', tipo);
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 3000); // Remove a notificação após 3 segundos
}

function verHistorico() {
    window.location.href = 'historico.html';
}
