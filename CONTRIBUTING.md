# Contributing to LazorPay

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Setup for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/lazorpay.git
cd lazorpay

# Install dependencies
npm install

# Create a branch
git checkout -b feature/your-feature-name

# Start development
npm run dev
```

## 📝 Code Style

- **TypeScript**: All new code must be TypeScript
- **Formatting**: Use Prettier defaults
- **Components**: React functional components with hooks
- **Styling**: Tailwind CSS utility classes only

## 🧪 Testing Your Changes

1. Run the dev server: `npm run dev`
2. Test all 3 features manually:
   - Create a passkey wallet
   - Send a gasless transaction
   - Verify session persistence (refresh the page)

## 📁 Where to Add Code

| Type | Location |
|------|----------|
| New UI components | `src/components/ui/` |
| New SDK examples | `src/examples/` |
| Configuration | `src/lib/` |
| Documentation | `docs/` |

## 🔀 Pull Request Process

1. Update documentation if you change functionality
2. Add comments to explain non-obvious code
3. Test on both Chrome and Safari (passkey compatibility)
4. Reference any related issues in PR description

## 💡 Ideas for Contribution

- [ ] Add USDC transfer example
- [ ] Add token swap example
- [ ] Add dark mode toggle
- [ ] Add mobile-responsive improvements
- [ ] Improve error handling UX
- [ ] Add unit tests for components

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
