// features/wbs-management/mock/itemData.ts
// アイテムテーブル用のモックデータ

import type { Item, FGCode } from '../types';
import { fgCodes } from './fgOptions';

/**
 * サンプルデータ生成関数
 * 実際のプロジェクトでは、このデータはAPIから取得します
 * 
 * 大量データのテストのため、指定された件数のデータを生成します
 * 仮想スクロールのパフォーマンステストに使用できます
 */
export const generateMockItems = (count: number): Item[] => {
    const itemNames = [
        'aux trorom',
        'main pump',
        'valve assembly',
        'control unit',
        'sensor module',
        'cable set',
        'mounting bracket',
        'filter element',
        'gasket kit',
        'bearing unit',
        'motor assembly',
        'circuit board',
        'display panel',
        'cooling fan',
        'power supply',
        'hydraulic cylinder',
        'pressure gauge',
        'flow meter',
        'temperature sensor',
        'vibration damper',
        'coupling unit',
        'seal kit',
        'lubricant pump',
        'cooling tower',
        'heat exchanger'
    ];

    const costElements = ['6F22', '6F23', '6G11', '6G12', '7A01', '7A02', '8B15', '8B16', '9C33', '9D44'];
    const ibsCodes = ['F11', 'F12', 'G21', 'G22', 'H31', 'H32', 'J41', 'J42', 'K51', 'K52'];

    const items: Item[] = [];

    for (let i = 0; i < count; i++) {
        const jobNo = (3700 + Math.floor(i / 100)).toString();
        const itemIndex = i % itemNames.length;
        const fgIndex = i % fgCodes.length;
        const coreItemPrefix = `0${(Math.floor(i / 1000) % 99 + 1).toString().padStart(2, '0')}`;
        const itemSuffix = `${Math.floor((i % 1000) / 100)}${((i % 100) / 10).toString().padStart(2, '0')}`;

        items.push({
            jobNo,
            fg: fgCodes[fgIndex] as FGCode,
            coreItemNo: `${coreItemPrefix}-${fgCodes[fgIndex]}-${itemSuffix}`,
            itemNo: `${coreItemPrefix}-${fgCodes[fgIndex]}-${itemSuffix}`,
            itemName: itemNames[itemIndex],
            qty: Math.floor(Math.random() * 50) + 1,
            costElement: costElements[i % costElements.length],
            ibsCode: ibsCodes[i % ibsCodes.length]
        });
    }

    return items;
};

/**
 * デフォルトのモックデータ（1000件）
 * 実際のプロジェクトでは、以下のようなAPI呼び出しに置き換えます：
 * 
 * export const fetchItems = async (): Promise<Item[]> => {
 *   const response = await fetch('/api/wbs/items');
 *   return response.json();
 * };
 */
export const mockItems: Item[] = generateMockItems(1000);

// 最初の数件のデータ例（ドキュメント用）
export const sampleItems: Item[] = [
    {
        jobNo: "3773",
        fg: "A",
        coreItemNo: "01-A-201",
        itemNo: "01-A-201",
        itemName: "aux trorom",
        qty: 1,
        costElement: "6F22",
        ibsCode: "F11"
    },
    {
        jobNo: "3773",
        fg: "B",
        coreItemNo: "01-B-202",
        itemNo: "01-B-202",
        itemName: "main pump",
        qty: 2,
        costElement: "6G11",
        ibsCode: "G21"
    },
    {
        jobNo: "3774",
        fg: "C",
        coreItemNo: "02-C-101",
        itemNo: "02-C-101",
        itemName: "valve assembly",
        qty: 5,
        costElement: "6F23",
        ibsCode: "F12"
    }
];