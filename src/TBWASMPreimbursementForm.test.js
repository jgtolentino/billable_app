import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TBWASMPreimbursementForm from './TBWASMPreimbursementForm';

// Mock the fetch function
global.fetch = jest.fn();

describe('TBWASMPreimbursementForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the form', () => {
    render(<TBWASMPreimbursementForm />);
    expect(screen.getByText('TBWA\\SMP Reimbursement Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Receipt')).toBeInTheDocument();
    expect(screen.getByText('Upload Receipt')).toBeInTheDocument();
  });

  it('handles file upload and displays preview', async () => {
    render(<TBWASMPreimbursementForm />);
    const file = new File(['dummy content'], 'receipt.png', { type: 'image/png' });
    const input = screen.getByLabelText('Receipt');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByAltText('Receipt Preview')).toBeInTheDocument();
    });
  });

  it('displays error message for invalid file type', async () => {
    render(<TBWASMPreimbursementForm />);
    const file = new File(['dummy content'], 'receipt.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Receipt');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Invalid file type. Please upload a PNG, JPEG, or PDF file.')).toBeInTheDocument();
    });
  });

  it('submits form and adds new expense', async () => {
    const mockResponse = {
      date: '2024-10-20',
      category: 'Food',
      amount: 50,
      description: 'Lunch with client'
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    render(<TBWASMPreimbursementForm />);

    const file = new File(['dummy content'], 'receipt.png', { type: 'image/png' });
    const input = screen.getByLabelText('Receipt');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);
    fireEvent.click(screen.getByText('Upload Receipt'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/upload', expect.any(Object));
      expect(screen.getByText('Lunch with client')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<TBWASMPreimbursementForm />);

    const file = new File(['dummy content'], 'receipt.png', { type: 'image/png' });
    const input = screen.getByLabelText('Receipt');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);
    fireEvent.click(screen.getByText('Upload Receipt'));

    await waitFor(() => {
      expect(screen.getByText('Error uploading file. Please try again.')).toBeInTheDocument();
    });
  });
});
