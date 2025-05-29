// features/wbs-management/mock/dropdownOptions.ts
// IBS CodeとCost Elementのドロップダウン選択肢

/**
 * IBS Codeの選択肢
 */
export const ibsCodeOptions = [
    { value: 'F11', label: 'F11 - Foundation' },
    { value: 'F12', label: 'F12 - Floor Structure' },
    { value: 'G21', label: 'G21 - External Walls' },
    { value: 'G22', label: 'G22 - Internal Walls' },
    { value: 'H31', label: 'H31 - Steel Frame' },
    { value: 'H32', label: 'H32 - Concrete Frame' },
    { value: 'J41', label: 'J41 - Roof Structure' },
    { value: 'J42', label: 'J42 - Roof Covering' },
    { value: 'K51', label: 'K51 - Windows' },
    { value: 'K52', label: 'K52 - Doors' },
    { value: 'L61', label: 'L61 - Electrical' },
    { value: 'L62', label: 'L62 - Plumbing' },
    { value: 'M71', label: 'M71 - HVAC' },
    { value: 'M72', label: 'M72 - Fire Protection' },
];

/**
 * Cost Elementの選択肢
 */
export const costElementOptions = [
    { value: '6F22', label: '6F22 - Material Cost' },
    { value: '6F23', label: '6F23 - Labor Cost' },
    { value: '6G11', label: '6G11 - Equipment Cost' },
    { value: '6G12', label: '6G12 - Subcontractor Cost' },
    { value: '7A01', label: '7A01 - Direct Overhead' },
    { value: '7A02', label: '7A02 - Indirect Overhead' },
    { value: '8B15', label: '8B15 - General Conditions' },
    { value: '8B16', label: '8B16 - Profit Margin' },
    { value: '9C33', label: '9C33 - Contingency' },
    { value: '9D44', label: '9D44 - Escalation' },
];