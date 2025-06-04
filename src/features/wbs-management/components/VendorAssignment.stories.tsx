// VendorAssignment.stories.tsx
// ベンダー割り当てコンポーネントのStorybook実装
// 
// Storybookの役割と重要性：
// 1. コンポーネントの仕様書として機能
// 2. 異なる状態での動作確認
// 3. デザインシステムの一部として活用
// 4. 開発チーム間のコミュニケーションツール

import type { Meta, StoryObj } from '@storybook/react';
import VendorAssignmentPage from './VendorAssignmentPage';

// =============================================================================
// メタデータ設定
// Storybookでのコンポーネントの基本情報を定義
// =============================================================================

const meta: Meta<typeof VendorAssignmentPage> = {
    title: 'Pages/VendorAssignment',
    component: VendorAssignmentPage,
    parameters: {
        // レイアウト設定：フルスクリーンで表示
        layout: 'fullscreen',

        // ドキュメント用の説明
        docs: {
            description: {
                component: `
          ベンダー割り当て管理ページ
          
          このコンポーネントは、プロジェクトパッケージにベンダーを割り当てる機能を提供します。
          左側のテーブルで未割り当てベンダーを選択し、右側のカードに割り当てることができます。
          
          **主な機能:**
          - ベンダーの検索・フィルタリング
          - 複数ベンダーの一括選択
          - ベンダーの割り当て・削除
          - リアルタイムな統計情報表示
        `,
            },
        },
    },

    // Props制御のためのargTypes（今回はpropsなしのページコンポーネントなので空）
    argTypes: {},

    // デフォルトの装飾設定
    decorators: [
        (Story) => (
            <div style= {{ height: '100vh', background: '#f9fafb' }} >
    <Story />
    </div>
    ),
  ],
};

export default meta;

// ストーリーの型定義
type Story = StoryObj<typeof meta>;

// =============================================================================
// 基本的なストーリー群
// 異なるシナリオでのコンポーネントの動作を確認
// =============================================================================

/**
 * デフォルトの状態
 * 
 * 実際の業務シナリオを想定した基本的な状態です。
 * いくつかのベンダーが既に割り当てられており、
 * 追加でベンダーを割り当てることができる状態を表示します。
 */
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: `
          標準的な業務シナリオでの表示状態です。
          
          - 既に2社のベンダーが割り当て済み
          - 8社の未割り当てベンダーが選択可能
          - 検索機能とフィルタリングが利用可能
        `,
            },
        },
    },
};

/**
 * 空の状態（ベンダー未割り当て）
 * 
 * プロジェクト開始時など、まだベンダーが一つも
 * 割り当てられていない状態をシミュレートします。
 * 
 * この状態のストーリーを作ることで、
 * 空状態のUIが適切に設計されているかを確認できます。
 */
export const EmptyPackage: Story = {
    // ここでは props を直接制御できないので、
    // 実際の実装では Context API や props を使って
    // 初期状態を制御する必要があります
    parameters: {
        docs: {
            description: {
                story: `
          ベンダーが一つも割り当てられていない初期状態です。
          
          **確認ポイント:**
          - 空状態のメッセージが適切に表示されているか
          - ユーザーに次の行動を促すガイダンスがあるか
          - 統計情報が正しく「0」を表示しているか
        `,
            },
        },
    },
    // 実際の実装では、初期データを空にするためのpropsを渡します
    // args: {
    //   initialPackage: {
    //     PackageCode: "PKG-EMPTY",
    //     PackageName: "新規プロジェクト",
    //     Vendor: []
    //   }
    // }
};

// =============================================================================
// 個別コンポーネントのStories
// 複雑なコンポーネントを構成する子コンポーネントのテスト
// =============================================================================

// VendorSelectionTable のストーリー
// ※実際の実装では、このコンポーネントを独立してエクスポートする必要があります

const VendorTableMeta: Meta = {
    title: 'Components/VendorSelectionTable',
    // component: VendorSelectionTable, // 実際の実装では適切にimport
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
          ベンダー選択テーブルコンポーネント
          
          未割り当てベンダーの一覧表示と選択機能を提供します。
          TanStack Tableを使用した高機能なデータテーブルです。
        `,
            },
        },
    },
};

/**
 * ベンダーテーブル - 標準状態
 * 
 * 複数のベンダーが表示され、検索・選択が可能な状態です。
 */
export const VendorTableDefault = {
    // args: {
    //   vendors: mockVendors,
    //   selectedVendors: [],
    //   onSelectionChange: () => {},
    //   onAssign: () => {},
    //   isAssigning: false,
    // },
    parameters: {
        docs: {
            description: {
                story: `
          ベンダーテーブルの標準的な表示状態です。
          
          **機能確認項目:**
          - 全選択チェックボックスの動作
          - 個別選択チェックボックスの動作
          - 検索機能の有効性
          - 割り当てボタンの状態制御
        `,
            },
        },
    },
};

/**
 * ベンダーテーブル - ローディング状態
 * 
 * ベンダー割り当て処理中の状態をシミュレートします。
 * ユーザーが操作を重複して実行できないよう、
 * 適切にUIが無効化されていることを確認します。
 */
export const VendorTableLoading = {
    // args: {
    //   vendors: mockVendors,
    //   selectedVendors: ['1', '2'],
    //   onSelectionChange: () => {},
    //   onAssign: () => {},
    //   isAssigning: true, // ローディング状態
    // },
    parameters: {
        docs: {
            description: {
                story: `
          ベンダー割り当て処理中の状態です。
          
          **確認ポイント:**
          - 割り当てボタンが無効化されているか
          - ローディング表示が適切に表示されているか
          - ユーザーが混乱しないような明確な状態表示があるか
        `,
            },
        },
    },
};

/**
 * ベンダーテーブル - 空状態
 * 
 * 全てのベンダーが既に割り当て済みで、
 * 選択可能なベンダーがない状態です。
 */
export const VendorTableEmpty = {
    // args: {
    //   vendors: [], // 空の配列
    //   selectedVendors: [],
    //   onSelectionChange: () => {},
    //   onAssign: () => {},
    //   isAssigning: false,
    // },
    parameters: {
        docs: {
            description: {
                story: `
          選択可能なベンダーが存在しない状態です。
          
          **確認ポイント:**
          - 適切な空状態メッセージが表示されているか
          - ユーザーに次の行動を促すガイダンスがあるか
        `,
            },
        },
    },
};

// =============================================================================
// PackageCard のストーリー
// =============================================================================

const PackageCardMeta: Meta = {
    title: 'Components/PackageCard',
    // component: PackageCard, // 実際の実装では適切にimport
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
          パッケージカードコンポーネント
          
          割り当て済みベンダーの表示と削除機能を提供します。
          WBSカードと同様の視覚的なデザインを採用しています。
        `,
            },
        },
    },
};

/**
 * パッケージカード - ベンダー割り当て済み
 * 
 * 複数のベンダーが割り当てられた状態のカードです。
 */
export const PackageCardWithVendors = {
    // args: {
    //   packageData: {
    //     PackageCode: "PKG-123",
    //     PackageName: "基盤建設プロジェクト Alpha",
    //     Vendor: [
    //       { VendorCode: "ACME-001", VendorName: "Acme Engineering Corp" },
    //       { VendorCode: "TSW-002", VendorName: "Tokyo Steel Works" },
    //       { VendorCode: "NORDIC-003", VendorName: "Nordic Construction AB" }
    //     ]
    //   },
    //   onRemoveVendor: () => {},
    // },
    parameters: {
        docs: {
            description: {
                story: `
          複数のベンダーが割り当てられた状態のパッケージカードです。
          
          **確認ポイント:**
          - ベンダー情報が見やすく表示されているか
          - 削除ボタンが適切に配置されているか
          - カード内の情報が整理されているか
        `,
            },
        },
    },
};

/**
 * パッケージカード - 空状態
 * 
 * ベンダーが一つも割り当てられていない状態のカードです。
 * この状態でのユーザー体験が重要になります。
 */
export const PackageCardEmpty = {
    // args: {
    //   packageData: {
    //     PackageCode: "PKG-EMPTY",
    //     PackageName: "新規プロジェクト Beta",
    //     Vendor: [] // 空の配列
    //   },
    //   onRemoveVendor: () => {},
    // },
    parameters: {
        docs: {
            description: {
                story: `
          ベンダーが割り当てられていない空状態のカードです。
          
          **デザイン考慮点:**
          - 空状態が寂しく見えないような配慮
          - 次のアクションを促すメッセージ
          - 視覚的なガイダンスの提供
        `,
            },
        },
    },
};

// =============================================================================
// インタラクションテスト用のストーリー
// Storybook の addon-interactions を使用した自動テスト
// =============================================================================

/**
 * ユーザーインタラクションシナリオ
 * 
 * 実際のユーザー操作をシミュレートしたテストストーリーです。
 * addon-interactions を使用して、自動的な操作テストが可能です。
 */
export const UserInteractionScenario: Story = {
    parameters: {
        docs: {
            description: {
                story: `
          典型的なユーザー操作フローのシミュレーションです。
          
          **テストシナリオ:**
          1. ベンダーを検索する
          2. 複数のベンダーを選択する
          3. 割り当てボタンをクリックする
          4. 割り当て結果を確認する
          5. ベンダーを削除する
          
          このストーリーは自動テストとしても機能します。
        `,
            },
        },
    },
    // play関数でインタラクションを定義（addon-interactions必要）
    // play: async ({ canvasElement }) => {
    //   const canvas = within(canvasElement);
    //   
    //   // 検索操作のテスト
    //   await userEvent.type(canvas.getByPlaceholderText('ベンダー名で検索...'), 'Acme');
    //   
    //   // チェックボックス選択のテスト
    //   await userEvent.click(canvas.getAllByRole('checkbox')[1]);
    //   
    //   // 割り当てボタンクリックのテスト
    //   await userEvent.click(canvas.getByText('ベンダー割り当て'));
    //   
    //   // 結果の確認
    //   await expect(canvas.getByText('割り当て中...')).toBeInTheDocument();
    // },
};

// =============================================================================
// レスポンシブデザインテスト用のストーリー
// 異なる画面サイズでの表示確認
// =============================================================================

/**
 * モバイル表示テスト
 * 
 * 小さな画面サイズでの表示を確認するストーリーです。
 */
export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: `
          モバイルデバイスでの表示状態です。
          
          **確認ポイント:**
          - 2カラムレイアウトが適切に調整されているか
          - テーブルが横スクロール対応になっているか
          - ボタンやタッチターゲットが適切なサイズか
        `,
            },
        },
    },
};

/**
 * タブレット表示テスト
 * 
 * 中間的な画面サイズでの表示を確認するストーリーです。
 */
export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: `
          タブレットデバイスでの表示状態です。
          
          レスポンシブデザインの中間段階として、
          デスクトップとモバイルの橋渡し的な表示を確認します。
        `,
            },
        },
    },
};

// =============================================================================
// アクセシビリティテスト用のストーリー
// =============================================================================

/**
 * アクセシビリティ重視表示
 * 
 * キーボードナビゲーションやスクリーンリーダー対応を
 * 確認するためのストーリーです。
 */
export const AccessibilityFocused: Story = {
    parameters: {
        a11y: {
            // アクセシビリティチェックの設定
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: true,
                    },
                    {
                        id: 'keyboard-navigation',
                        enabled: true,
                    },
                ],
            },
        },
        docs: {
            description: {
                story: `
          アクセシビリティに配慮した表示状態です。
          
          **チェック項目:**
          - キーボードのみでの操作が可能か
          - 適切な ARIA ラベルが設定されているか
          - 色のコントラストが十分か
          - フォーカス表示が明確か
        `,
            },
        },
    },
};

// =============================================================================
// パフォーマンステスト用のストーリー
// =============================================================================

/**
 * 大量データ表示テスト
 * 
 * 多数のベンダーが存在する場合のパフォーマンスを
 * 確認するためのストーリーです。
 */
export const LargeDataSet: Story = {
    parameters: {
        docs: {
            description: {
                story: `
          大量のベンダーデータでのパフォーマンステストです。
          
          **パフォーマンス確認項目:**
          - 初期表示の速度
          - 検索フィルタリングの応答性
          - スクロールの滑らかさ
          - メモリ使用量の最適化
        `,
            },
        },
    },
    // 実際の実装では、大量のモックデータを生成して渡します
    // args: {
    //   initialVendors: generateLargeVendorDataSet(1000), // 1000件のベンダー
    // },
};

// =============================================================================
// エラー状態のストーリー
// =============================================================================

/**
 * エラー状態表示
 * 
 * APIエラーやネットワークエラーが発生した場合の
 * 表示を確認するストーリーです。
 */
export const ErrorState: Story = {
    parameters: {
        docs: {
            description: {
                story: `
          エラー状態での表示です。
          
          **エラーハンドリング確認:**
          - 適切なエラーメッセージが表示されているか
          - ユーザーが回復アクションを取れるか
          - エラー状態でもアプリケーションが安定しているか
        `,
            },
        },
    },
    // 実際の実装では、エラー状態を模擬するpropsを渡します
    // args: {
    //   hasError: true,
    //   errorMessage: "ベンダーデータの取得に失敗しました。しばらくしてから再試行してください。",
    // },
};
