import { render, screen, waitFor } from '@testing-library/react';
import { MRGDataTable } from '../ui/MrgDataTable';
import { MRGData } from '../../../shared/types/mrg';
import * as React from 'react';

const mockData: MRGData[] = [
  {
    id: '1',
    pipeline: 'Pipeline 1',
    mg: 'MG 1',
    km: 100,
    date: '2024-03-20',
    loadLevel: 80,
    avgFlow: 1000,
    tvps: 1200
  },
  {
    id: '2',
    pipeline: 'Pipeline 2',
    mg: 'MG 2',
    km: 200,
    date: '2024-03-21',
    loadLevel: 90,
    avgFlow: 2000,
    tvps: 2400
  }
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <div style={{ width: '100%', height: '800px' }}>
      {ui}
    </div>
  );
};

describe('MRGDataTable Component', () => {
  it('renders table with data', async () => {
    renderWithProviders(<MRGDataTable data={mockData} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(screen.getByText('Магистральный распределительный газопровод')).toBeInTheDocument();
      expect(screen.getByText('Точка подключения')).toBeInTheDocument();
      expect(screen.getByText('МГ (РГ, КС, УРГ)')).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(screen.getByText('Записей на странице:')).toBeInTheDocument();
      expect(screen.getByText('Страница 1 из 1')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('renders empty state when no data', async () => {
    renderWithProviders(<MRGDataTable data={[]} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(screen.getByText('Страница 1 из 0')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);
}); 