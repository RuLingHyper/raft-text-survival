import React, { useState } from 'react';
import { ITEMS } from '../data/items';

const GameMain = () => {
    // Oyuncunun envanterini tutacağımız React State
    const [inventory, setInventory] = useState([
        // Oyuna başlarken verilecek başlangıç eşyaları
        {
            itemId: 'hook',
            instanceId: 'hook_1',
            durability: ITEMS.hook.maxDurability,
            amount: 1
        },
        {
            itemId: 'wood',
            amount: 5
        }
    ]);

    // Envantere yeni eşya ekleme fonksiyonu
    const addToInventory = (newItemId, amountToAdd = 1) => {
        const itemDbInfo = ITEMS[newItemId]; // Eşyanın özelliklerine veritabanından bakıyoruz

        setInventory(prevInventory => {
            // 1. DURUM: Eğer eşya bir "kaynak" ise (Tahta, Plastik vs.) üst üste eklemeliyiz
            if (itemDbInfo.type === 'resource') {
                // Envanterde bu eşyadan zaten var mı kontrol et
                const existingItemIndex = prevInventory.findIndex(item => item.itemId === newItemId);

                if (existingItemIndex >= 0) {
                    // Varsa, sadece sayısını (amount) artır
                    const newInventory = [...prevInventory];
                    newInventory[existingItemIndex].amount += amountToAdd;
                    return newInventory;
                } else {
                    // Yoksa, envantere yeni bir kayıt olarak ekle
                    return [...prevInventory, { itemId: newItemId, amount: amountToAdd }];
                }
            }

            // 2. DURUM: Eğer eşya bir "alet" veya "silah" ise (Kanca, Olta) canıyla birlikte ayrı ayrı eklemeliyiz
            if (itemDbInfo.type === 'tool' || itemDbInfo.type === 'weapon') {
                const newTool = {
                    itemId: newItemId,
                    instanceId: Date.now().toString(), // Benzersiz bir kimlik veriyoruz (şu anki zaman)
                    durability: itemDbInfo.maxDurability, // Maksimum canını veriyoruz
                    amount: 1
                };
                return [...prevInventory, newTool];
            }

            return prevInventory;
        });
    };

    return (
        <div style={{ color: 'white', padding: '20px' }}>
            <h2>Okyanusun Ortası</h2>
            <p>Şu an envanterinde {inventory.length} çeşit eşya var.</p>
        </div>
    );
};

export default GameMain;