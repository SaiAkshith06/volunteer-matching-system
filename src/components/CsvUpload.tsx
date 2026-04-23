import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface CsvUploadProps {
  label: string;
  accept?: string;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({
  label,
  accept = '.csv',
  isLoading,
  onFileSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => { inputRef.current?.click(); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.csv')) return;
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="relative">
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" aria-label={label} />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="btn-soft flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2a9d8f] rounded-full animate-spin" />
        ) : (
          <Upload size={14} className="text-[#2a9d8f]" />
        )}
        <span>{label}</span>
      </button>
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
        <FileText size={10} />
        <span>CSV format only</span>
      </div>
    </div>
  );
};

export default CsvUpload;
