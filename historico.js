document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('historico')) {
        const historico = JSON.parse(localStorage.getItem('historico'));
        historico.forEach(item => {
            adicionarGastoAoHistorico(item.data, item.motivo, item.valor);
        });
    }
});

function adicionarGastoAoHistorico(data, motivo, valor) {
    const historico = document.getElementById('historico');
    const li = document.createElement('li');
    li.textContent = `${data}: ${motivo} - R$${valor.toFixed(2)}`;
    
    const excluirButton = document.createElement('button');
    excluirButton.textContent = 'Excluir';
    excluirButton.onclick = () => confirmarExclusao(li, data, motivo, valor); // Passando dados para exclusão

    const atualizarButton = document.createElement('button');
    atualizarButton.textContent = 'Atualizar';
    atualizarButton.onclick = () => abrirModalAtualizacao(li, data, motivo, valor);

    li.appendChild(excluirButton);
    li.appendChild(atualizarButton);
    historico.appendChild(li);
}

function confirmarExclusao(item, data, motivo, valor) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const mensagem = document.createElement('p');
    mensagem.textContent = 'Você tem certeza que deseja excluir este registro?';

    const confirmarButton = document.createElement('button');
    confirmarButton.textContent = 'Confirmar';
    confirmarButton.onclick = () => {
        excluirGasto(item, data, motivo, valor);
        fecharModal();
    };

    const cancelarButton = document.createElement('button');
    cancelarButton.textContent = 'Cancelar';
    cancelarButton.onclick = fecharModal;

    modalContent.appendChild(mensagem);
    modalContent.appendChild(confirmarButton);
    modalContent.appendChild(cancelarButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function abrirModalAtualizacao(item, data, motivo, valor) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const titulo = document.createElement('h2');
    titulo.textContent = 'Atualizar Gasto';

    const labelMotivo = document.createElement('label');
    labelMotivo.textContent = 'Motivo:';
    const inputMotivo = document.createElement('input');
    inputMotivo.type = 'text';
    inputMotivo.value = motivo;

    const labelValor = document.createElement('label');
    labelValor.textContent = 'Valor:';
    const inputValor = document.createElement('input');
    inputValor.type = 'number';
    inputValor.value = valor;

    const labelData = document.createElement('label');
    labelData.textContent = 'Data:';
    const inputData = document.createElement('input');
    inputData.type = 'date';
    inputData.value = data;

    const atualizarButton = document.createElement('button');
    atualizarButton.textContent = 'Atualizar';
    atualizarButton.onclick = () => {
        const novoMotivo = inputMotivo.value;
        const novoValor = parseFloat(inputValor.value);
        const novaData = inputData.value;

        if (novoMotivo && !isNaN(novoValor) && novaData) {
            atualizarGasto(item, data, motivo, valor, novoMotivo, novoValor, novaData);
            fecharModal();
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    };

    const cancelarButton = document.createElement('button');
    cancelarButton.textContent = 'Cancelar';
    cancelarButton.onclick = fecharModal;

    modalContent.appendChild(titulo);
    modalContent.appendChild(labelMotivo);
    modalContent.appendChild(inputMotivo);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(labelValor);
    modalContent.appendChild(inputValor);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(labelData);
    modalContent.appendChild(inputData);
    modalContent.appendChild(document.createElement('br'));
    modalContent.appendChild(atualizarButton);
    modalContent.appendChild(cancelarButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function atualizarGasto(item, data, motivoAntigo, valorAntigo, novoMotivo, novoValor, novaData) {
    const historico = JSON.parse(localStorage.getItem('historico'));
    const novoHistorico = historico.map(gasto => {
        if (gasto.data === data && gasto.motivo === motivoAntigo && gasto.valor === valorAntigo) {
            return { data: novaData, motivo: novoMotivo, valor: novoValor };
        }
        return gasto;
    });
    localStorage.setItem('historico', JSON.stringify(novoHistorico));

    item.textContent = `${novaData}: ${novoMotivo} - R$${novoValor.toFixed(2)}`;
    mostrarNotificacao('Gasto atualizado com sucesso!', 'success');
}

function excluirGasto(item, data, motivo, valor) {
    const historico = JSON.parse(localStorage.getItem('historico'));
    const novoHistorico = historico.filter(gasto => !(gasto.data === data && gasto.motivo === motivo && gasto.valor === valor));
    localStorage.setItem('historico', JSON.stringify(novoHistorico));

    item.remove();
    mostrarNotificacao('Gasto excluído com sucesso!', 'success');
}

function fecharModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
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

function excluirTudo() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const mensagem = document.createElement('p');
    mensagem.textContent = 'Você tem certeza que deseja excluir todos os dados? Esta ação não poderá ser desfeita.';

    const confirmarButton = document.createElement('button');
    confirmarButton.textContent = 'Confirmar';
    confirmarButton.onclick = () => {
        localStorage.removeItem('saldoAtual');
        localStorage.removeItem('historico');
        document.getElementById('historico').innerHTML = '';
        mostrarNotificacao('Todos os dados foram excluídos.', 'success');
        fecharModal();
    };

    const cancelarButton = document.createElement('button');
    cancelarButton.textContent = 'Cancelar';
    cancelarButton.onclick = fecharModal;

    modalContent.appendChild(mensagem);
    modalContent.appendChild(confirmarButton);
    modalContent.appendChild(cancelarButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function voltarInicio() {
    window.location.href = 'index.html';
}
