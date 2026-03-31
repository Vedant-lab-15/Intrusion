#!/usr/bin/env bash
# =============================================================================
# IDS Security Dashboard — One-command setup script
# Supports: macOS, Ubuntu/Debian, Fedora/RHEL, Arch Linux
# Usage:  bash setup.sh          (demo mode, no Supabase needed)
#         bash setup.sh --prod   (prompts for Supabase credentials)
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }
step()    { echo -e "\n${BOLD}▶ $*${RESET}"; }

PROD_MODE=false
[[ "${1:-}" == "--prod" ]] && PROD_MODE=true

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}"
echo "  ╔══════════════════════════════════════════╗"
echo "  ║      IDS Security Dashboard Setup        ║"
echo "  ╚══════════════════════════════════════════╝"
echo -e "${RESET}"

# ── 1. Check OS ───────────────────────────────────────────────────────────────
step "Detecting operating system"
OS="$(uname -s)"
case "$OS" in
  Linux*)  PLATFORM="linux" ;;
  Darwin*) PLATFORM="macos" ;;
  *)       error "Unsupported OS: $OS. Please use macOS or Linux." ;;
esac
success "Platform: $PLATFORM"

# ── 2. Check / install Node.js ────────────────────────────────────────────────
step "Checking Node.js (requires v18+)"
NODE_MIN=18

install_node_linux() {
  info "Installing Node.js via NodeSource..."
  if command -v apt-get &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif command -v dnf &>/dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
  elif command -v pacman &>/dev/null; then
    sudo pacman -Sy --noconfirm nodejs npm
  else
    error "Cannot auto-install Node.js. Please install Node.js $NODE_MIN+ from https://nodejs.org and re-run this script."
  fi
}

install_node_macos() {
  if command -v brew &>/dev/null; then
    info "Installing Node.js via Homebrew..."
    brew install node
  else
    error "Homebrew not found. Install it from https://brew.sh, then re-run this script.\nOr install Node.js directly from https://nodejs.org"
  fi
}

if command -v node &>/dev/null; then
  NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
  if (( NODE_VER < NODE_MIN )); then
    warn "Node.js $NODE_VER found but $NODE_MIN+ is required. Upgrading..."
    [[ "$PLATFORM" == "linux" ]] && install_node_linux || install_node_macos
  else
    success "Node.js $(node --version) found"
  fi
else
  warn "Node.js not found. Installing..."
  [[ "$PLATFORM" == "linux" ]] && install_node_linux || install_node_macos
  success "Node.js $(node --version) installed"
fi

# ── 3. Check / install pnpm ───────────────────────────────────────────────────
step "Checking pnpm"
if ! command -v pnpm &>/dev/null; then
  info "Installing pnpm..."
  npm install -g pnpm
  success "pnpm $(pnpm --version) installed"
else
  success "pnpm $(pnpm --version) found"
fi

# ── 4. Install project dependencies ──────────────────────────────────────────
step "Installing project dependencies"
pnpm install --frozen-lockfile
success "Dependencies installed"

# ── 5. Environment setup ──────────────────────────────────────────────────────
step "Setting up environment"

if [[ -f ".env.local" ]]; then
  success ".env.local already exists — skipping"
else
  cp .env.example .env.local
  if [[ "$PROD_MODE" == true ]]; then
    echo ""
    echo -e "${YELLOW}Supabase setup (press Enter to skip and use demo mode):${RESET}"
    read -rp "  VITE_SUPABASE_URL: " SUPA_URL
    read -rp "  VITE_SUPABASE_ANON_KEY: " SUPA_KEY
    if [[ -n "$SUPA_URL" && -n "$SUPA_KEY" ]]; then
      # Use sed to replace placeholder values
      sed -i.bak "s|https://your-project-id.supabase.co|$SUPA_URL|g" .env.local
      sed -i.bak "s|your-anon-key-here|$SUPA_KEY|g" .env.local
      rm -f .env.local.bak
      success "Supabase credentials saved to .env.local"
    else
      warn "No credentials entered — running in demo mode"
    fi
  else
    success ".env.local created (demo mode — no Supabase needed)"
  fi
fi

# ── 6. Run tests ──────────────────────────────────────────────────────────────
step "Running test suite"
if pnpm test; then
  success "All tests passed"
else
  warn "Some tests failed — the app will still run, but check the output above"
fi

# ── 7. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║  Setup complete! Start the dev server with:          ║${RESET}"
echo -e "${GREEN}${BOLD}║                                                      ║${RESET}"
echo -e "${GREEN}${BOLD}║    pnpm dev                                          ║${RESET}"
echo -e "${GREEN}${BOLD}║                                                      ║${RESET}"
echo -e "${GREEN}${BOLD}║  Then open: http://localhost:5173                    ║${RESET}"
echo -e "${GREEN}${BOLD}║                                                      ║${RESET}"
echo -e "${GREEN}${BOLD}║  Demo login:  admin / Admin@2024!                    ║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""
