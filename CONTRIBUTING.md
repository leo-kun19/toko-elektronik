# 🤝 Contributing Guidelines

Selamat datang di project **Toko Elektronik**! Panduan ini akan membantu anggota tim untuk berkontribusi secara efektif.

## 👥 Team Structure

| Role | Nama | GitHub Username | Responsibilities |
|------|------|----------------|------------------|
| 🎯 Project Manager | Leo | @leo-kun19 | Project coordination, timeline management |
| 🎨 UI/UX Designer | Nisa | @[username] | Design, user experience, prototyping |
| 💻 Frontend Developer | Aulia | @[username] | ReactJS development |
| ⚙️ Backend Developer | Dini | @[username] | NextJS API development |
| 📊 Product & Financial Manager | Diki | @[username] | Business logic, financial features |

## 🌟 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/leo-kun19/toko-elektronik.git
cd toko-elektronik
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Setup Environment
```bash
cp backend/.env.example backend/.env.local
# Edit .env.local dengan credentials yang benar
```

### 4. Start Development
```bash
npm run dev
```

## 🌿 Branching Strategy

### Branch Types
- **`main`**: Production-ready code
- **`staging`**: Pre-production testing
- **`development`**: Integration branch for features
- **`feature/[feature-name]`**: New feature development
- **`fix/[issue-name]`**: Bug fixes
- **`hotfix/[issue-name]`**: Critical production fixes

### Workflow
1. **Buat Feature Branch** dari `development`
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/nama-fitur
   ```

2. **Development & Testing**
   - Write code
   - Test locally
   - Commit dengan conventional format

3. **Push & Pull Request**
   ```bash
   git push origin feature/nama-fitur
   ```
   - Create Pull Request ke `development`
   - Request review dari 2+ team members

4. **Code Review & Merge**
   - Address review comments
   - Merge setelah approval

## 📝 Commit Convention

Gunakan format [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting, missing semicolons
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples:
```bash
feat(auth): add Google OAuth login
fix(cart): resolve quantity update bug
docs(readme): update installation instructions
style(components): fix ESLint formatting issues
```

## 🔍 Code Review Process

### Sebagai Author:
1. **Self-review** kode sebelum submit PR
2. **Test thoroughly** di local environment
3. **Write descriptive** PR description
4. **Link related issues** dengan "Closes #123"
5. **Request appropriate reviewers**

### Sebagai Reviewer:
1. **Check functionality** - Does it work as intended?
2. **Review code quality** - Is it maintainable?
3. **Test locally** if possible
4. **Be constructive** in feedback
5. **Approve** only when satisfied

### Review Checklist:
- [ ] Code follows project style guidelines
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Tests added for new features
- [ ] Documentation updated if needed
- [ ] No merge conflicts
- [ ] CI/CD passes

## 🧪 Testing Guidelines

### Frontend Testing
```bash
cd frontend
npm run test
```
- Write unit tests for components
- Test user interactions
- Verify responsive design

### Backend Testing
```bash
cd backend
npm run test
```
- Test API endpoints
- Validate database operations
- Check authentication & authorization

### Integration Testing
```bash
npm run test
```
- Test frontend-backend communication
- Verify complete user flows
- Check API integrations

## 📂 Code Organization

### Frontend Structure
```
frontend/src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── utils/              # Utility functions
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

### Backend Structure
```
backend/
├── pages/api/          # NextJS API routes
├── lib/                # Utility libraries
├── middleware/         # Custom middleware
├── models/             # Database models (Prisma)
├── services/           # Business logic
└── utils/              # Helper functions
```

## 🎨 Style Guidelines

### Frontend (React/TypeScript):
```typescript
// Use functional components with hooks
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      {/* Component JSX */}
    </div>
  );
};
```

### Backend (NextJS API):
```typescript
// pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '@/services/productService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const products = await getProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## 📋 Issue Management

### Creating Issues
1. Gunakan appropriate template:
   - 🐛 Bug Report
   - 🚀 Feature Request
   - 📋 Task

2. **Fill semua required fields**
3. **Add proper labels**:
   - Priority: `low`, `medium`, `high`, `critical`
   - Type: `bug`, `enhancement`, `task`
   - Component: `frontend`, `backend`, `ui-ux`, `docs`
   - Assignee: Tag appropriate team member

### Working on Issues
1. **Assign yourself** to the issue
2. **Move to "In Progress"** di project board
3. **Create feature branch** dengan naming: `feature/issue-123-short-description`
4. **Link commits** dengan issue number: `feat: add login form (refs #123)`
5. **Close with PR**: "Closes #123"

## 🚀 Deployment Process

### Staging Deployment
1. Merge feature ke `development`
2. Create PR dari `development` ke `staging`
3. Deploy ke staging environment
4. Test functionality
5. Get stakeholder approval

### Production Deployment
1. Create PR dari `staging` ke `main`
2. Final review & approval
3. Deploy ke production
4. Monitor for issues
5. Create release notes

## 🔒 Security Guidelines

### Environment Variables
- **Never commit** .env files
- **Use .env.example** untuk dokumentasi
- **Rotate secrets** regularly
- **Use strong passwords** untuk database

### Code Security
- **Validate input** pada semua endpoints
- **Sanitize data** sebelum database queries
- **Use HTTPS** untuk semua communications
- **Implement rate limiting** pada API endpoints

## 📞 Communication

### Daily Standups (if applicable)
- What did you work on yesterday?
- What will you work on today?
- Any blockers or help needed?

### Weekly Reviews
- Progress review dengan project manager
- Discuss upcoming features
- Address any technical challenges

### Slack/Discord Channels
- **#general**: General discussion
- **#dev-frontend**: Frontend development
- **#dev-backend**: Backend development
- **#design**: UI/UX discussions
- **#deployment**: Deployment notifications

## 🆘 Getting Help

### Technical Issues
1. **Check documentation** first
2. **Search existing issues** di GitHub
3. **Ask dalam team chat**
4. **Create detailed issue** jika diperlukan

### Project Questions
- **Contact project manager**: Leo (@leo-kun19)
- **Technical lead**: Dini (Backend) / Aulia (Frontend)

## 📚 Resources

### Learning Materials
- [React Documentation](https://reactjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Tools
- **Code Editor**: VSCode dengan extensions
- **API Testing**: Postman/Insomnia
- **Database**: PostgreSQL + Prisma Studio
- **Design**: Figma

---

**Happy Contributing! 🚀**

Jika ada pertanyaan atau saran untuk improve guidelines ini, silakan buat issue atau hubungi project manager.
