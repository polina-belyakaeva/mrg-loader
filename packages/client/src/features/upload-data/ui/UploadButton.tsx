import React, { useRef, FC, ChangeEvent } from 'react';

interface UploadButtonProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const UploadButton: FC<UploadButtonProps> = ({ onFileUpload, disabled, loading, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
    event.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />
      <button onClick={handleButtonClick} disabled={disabled || loading} className={className}>
        {loading ? 'Загрузка...' : 'Загрузить данные'}
      </button>
    </div>
  );
};
