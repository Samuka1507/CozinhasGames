function handlePlateStation(player) {
    const h = player.holding;

    // Caso 1: Jogador sem nada na mão
    if (!h) {
        if (plateStation.plate) {
            player.holding = plateStation.plate;
            plateStation.plate = null;
            showMsg('Prato pego da estação');
            updateOrdersUI();
            return;
        }
        if (cleanPlatesAvailable > 0) {
            player.holding = { type: 'plate', contents: [], dirty: false };
            cleanPlatesAvailable--;
            showMsg('Pegou prato limpo');
            updateOrdersUI();
            return;
        }
        showMsg('Sem pratos disponíveis');
        return;
    }

    // Caso 2: Jogador segurando prato
    if (h.type === 'plate') {
        if (h.dirty) {
            showMsg('Lave o prato antes de guardar');
            return;
        }
        if (h.contents.length > 0) {
            showMsg('Prato com comida não pode ser guardado');
            return;
        }
        if (plateStation.plate) {
            showMsg('Já há um prato na estação');
            return;
        }
        plateStation.plate = h;
        player.holding = null;
        showMsg('Prato colocado na estação');
        updateOrdersUI();
        return;
    }

    // Caso 3: Jogador segurando alimento processado
    if (h.state === 'chopped' || h.state === 'cooked') {
        // Se não houver prato na estação, cria um automaticamente (se houver pratos limpos)
        if (!plateStation.plate) {
            if (cleanPlatesAvailable > 0) {
                plateStation.plate = { type: 'plate', contents: [], dirty: false };
                cleanPlatesAvailable--;
                showMsg('Prato colocado automaticamente');
            } else {
                showMsg('Sem pratos limpos para usar');
                return;
            }
        }
        if (plateStation.plate.contents.some(c => c.type === h.type)) {
            showMsg('Já tem esse item no prato');
            return;
        }
        plateStation.plate.contents.push({ type: h.type, state: h.state });
        player.holding = null;
        showMsg(`+ ${ING_NAME[h.type] || h.type}`);
        updateOrdersUI();
        return;
    }

    // Alimento cru ou outro item não processado
    showMsg('Processe o alimento antes!');
}