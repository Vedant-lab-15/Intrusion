import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataManagement from '@/components/DataManagement'

describe('DataManagement', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the data table with default data', () => {
    render(<DataManagement />)
    expect(screen.getByText('Security Incident Trends Data')).toBeInTheDocument()
    // Default data has 6 months
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
  })

  it('shows validation error when adding a point without a name', async () => {
    const user = userEvent.setup()
    render(<DataManagement />)

    await user.click(screen.getByRole('button', { name: /add data point/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert').textContent).toMatch(/period name is required/i)
    })
  })

  it('adds a valid data point', async () => {
    const user = userEvent.setup()
    render(<DataManagement />)

    const initialRows = screen.getAllByRole('row').length

    await user.type(screen.getByPlaceholderText(/e.g. Jul 2024/i), 'Aug 2024')
    await user.clear(screen.getAllByRole('spinbutton')[0])
    await user.type(screen.getAllByRole('spinbutton')[0], '100')

    await user.click(screen.getByRole('button', { name: /add data point/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(initialRows + 1)
    })
  })

  it('shows validation error when mitigated exceeds attacks', async () => {
    const user = userEvent.setup()
    render(<DataManagement />)

    await user.type(screen.getByPlaceholderText(/e.g. Jul 2024/i), 'Sep 2024')
    // attacks = 0 (default), mitigated = 100
    await user.clear(screen.getAllByRole('spinbutton')[1])
    await user.type(screen.getAllByRole('spinbutton')[1], '100')

    await user.click(screen.getByRole('button', { name: /add data point/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/mitigated cannot exceed/i)
    })
  })

  it('deletes a data point', async () => {
    const user = userEvent.setup()
    render(<DataManagement />)

    const initialRows = screen.getAllByRole('row').length
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(initialRows - 1)
    })
  })

  it('sanitizes text input — strips HTML characters', async () => {
    const user = userEvent.setup()
    render(<DataManagement />)

    const periodInput = screen.getByPlaceholderText(/e.g. Jul 2024/i)
    await user.type(periodInput, '<script>alert(1)</script>')

    // The sanitized value should not contain < or >
    expect((periodInput as HTMLInputElement).value).not.toContain('<')
    expect((periodInput as HTMLInputElement).value).not.toContain('>')
  })
})
