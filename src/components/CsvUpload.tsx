import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

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

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      return;
    }

    onFileSelect(file);

    // Reset so user can upload the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <Upload size={16} className="text-blue-500" />
        )}
        <span>{label}</span>
      </button>

      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
        <FileText size={10} />
        <span>CSV format only</span>
        <AlertCircle size={10} className="ml-1" />
      </div>
    </div>
  );
};

export default CsvUpload;
