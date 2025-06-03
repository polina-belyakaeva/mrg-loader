import { render, screen, fireEvent } from '@testing-library/react';
import { UploadButton } from '../ui/UploadButton';

describe('UploadButton Component', () => {
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    mockOnFileUpload.mockClear();
  });

  it('renders upload button', () => {
    render(<UploadButton onFileUpload={mockOnFileUpload} />);

    expect(screen.getByText('Загрузить данные')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<UploadButton onFileUpload={mockOnFileUpload} />);

    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByRole('button');

    fireEvent.click(input);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    fireEvent.change(fileInput);

    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
  });

  it('shows loading state', () => {
    render(<UploadButton onFileUpload={mockOnFileUpload} loading={true} />);

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<UploadButton onFileUpload={mockOnFileUpload} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disables button when loading', () => {
    render(<UploadButton onFileUpload={mockOnFileUpload} loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
}); 