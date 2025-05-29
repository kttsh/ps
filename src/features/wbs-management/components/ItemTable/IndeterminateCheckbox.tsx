// features/wbs-management/components/ItemTable/IndeterminateCheckbox.tsx
//
// ✔ forwardRef を使わず “自前の ref” だけに変更
// ✔ InputHTMLAttributes をそのまま継承
// ✔ indeterminate プロパティだけ副作用で付与
//

import React, { useRef, useEffect } from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** true で三態チェックボックスの「中間」表示 */
  indeterminate?: boolean;
};

export const IndeterminateCheckbox: React.FC<Props> = ({
  indeterminate,
  className,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  // indeterminate（◪ 状態）を DOM プロパティで設定
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={className ?? 'h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500'}
      {...rest}
    />
  );
};