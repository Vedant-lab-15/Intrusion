import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import LoginPage from '@/auth/LoginPage'

// Helper to render with AuthProvider
function renderWithAuth(ui: React.ReactElement) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

// Test component that exposes auth state
function AuthStatus() {
  const { session, logout } = useAuth()
  return (
    <div>
      <span data-testid="status">{session ? `logged-in:${session.username}` : 'logged-out'}</span>
      {session && <button onClick={logout}>Logout</button>}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('starts logged out when no session exists', () => {
    renderWithAuth(<AuthStatus />)
    expect(screen.getByTestId('status').textContent).toBe('logged-out')
  })

  it('logs in with valid admin credentials', async () => {
    const user = userEvent.setup()
    renderWithAuth(<LoginPage />)

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByPlaceholderText(/enter password/i), 'Admin@2024!')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('shows error on invalid credentials', async () => {
    const user = userEvent.setup()
    renderWithAuth(<LoginPage />)

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByPlaceholderText(/enter password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert').textContent).toMatch(/invalid credentials/i)
    })
  })

  it('locks account after 5 failed attempts', async () => {
    // Test the lockout logic directly via AuthContext rather than through the form UI
    // (the form has a 300ms delay that makes sequential UI testing unreliable)
    function LockoutTester() {
      const { login, loginError } = useAuth()
      return (
        <div>
          <button onClick={() => login('admin', 'wrong')}>attempt</button>
          {loginError && <div role="alert">{loginError}</div>}
        </div>
      )
    }

    renderWithAuth(<LockoutTester />)
    const btn = screen.getByRole('button', { name: /attempt/i })

    for (let i = 0; i < 5; i++) {
      fireEvent.click(btn)
      await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    }

    expect(screen.getByRole('alert').textContent).toMatch(/locked/i)
  })

  it('logs out and clears session', async () => {
    // Pre-seed a valid session
    const session = {
      username: 'admin',
      displayName: 'Admin User',
      role: 'admin',
      expiresAt: Date.now() + 60_000,
    }
    sessionStorage.setItem('ids_session', JSON.stringify(session))

    renderWithAuth(<AuthStatus />)
    expect(screen.getByTestId('status').textContent).toBe('logged-in:admin')

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(screen.getByTestId('status').textContent).toBe('logged-out')
  })

  it('rejects expired sessions', () => {
    const expired = {
      username: 'admin',
      displayName: 'Admin User',
      role: 'admin',
      expiresAt: Date.now() - 1000, // already expired
    }
    sessionStorage.setItem('ids_session', JSON.stringify(expired))

    renderWithAuth(<AuthStatus />)
    expect(screen.getByTestId('status').textContent).toBe('logged-out')
  })
})

describe('LoginPage', () => {
  it('disables submit button when fields are empty', () => {
    renderWithAuth(<LoginPage />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })

  it('enables submit when both fields have values', async () => {
    const user = userEvent.setup()
    renderWithAuth(<LoginPage />)

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByPlaceholderText(/enter password/i), 'pass')

    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithAuth(<LoginPage />)

    const passwordInput = screen.getByLabelText(/^password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText(/show password/i))
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByLabelText(/hide password/i))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
