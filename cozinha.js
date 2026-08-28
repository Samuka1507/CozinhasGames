// Bancada de apoio (guardar/pegar itens)
if (station === 'counter') {
    const key = `${tx},${ty}`;
    const item = storedItems[key];

    // Se o jogador está segurando um prato e há alimento processado na bancada
    if (player.holding && player.holding.type === 'plate' && item && item.type !== 'plate') {
        if (player.holding.dirty) {
            showMsg('Prato sujo! Lave na pia');
            return;
        }
        if (item.state !== 'chopped' && item.state !== 'cooked') {
            showMsg('Processe o alimento antes!');
            return;
        }
        if (player.holding.contents.some(c => c.type === item.type)) {
            showMsg('Já tem esse item no prato');
            return;
        }
        // Adiciona ao prato e remove da bancada
        player.holding.contents.push({ type: item.type, state: item.state });
        delete storedItems[key];
        showMsg(`+ ${ING_NAME[item.type] || item.type}`);
        updateOrdersUI();
        return;
    }

    // Comportamento padrão (guardar/pegar itens)
    if (player.holding) {
        if (!storedItems[key]) {
            storedItems[key] = player.holding;
            player.holding = null;
            showMsg('Item deixado na bancada');
        } else {
            showMsg('Bancada ocupada');
        }
    } else {
        if (storedItems[key]) {
            player.holding = storedItems[key];
            delete storedItems[key];
            showMsg('Item pego');
        } else {
            showMsg('Bancada vazia');
        }
    }
    return;
}