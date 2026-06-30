# Contributing to Hirfa (حِرفة)

Thank you for your interest in contributing to **Hirfa**! We welcome contributions from developers of all skill levels. Whether you are fixing a bug, implementing a new feature, or improving documentation, your help is appreciated.

This document provides a set of guidelines and instructions for contributing to the repository.

---

## 🛠️ Tech Stack Overview
Before you start, please familiarize yourself with the tools we use:
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database / Auth:** Supabase (PostgreSQL)
- **Mobile Wrapper:** Capacitor
- **Package Manager:** `pnpm` (highly recommended over `npm` or `yarn`)

---

## 🚀 How to Contribute

### 1. Setup Your Local Environment
1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/your-username/Hirfa.git
   cd Hirfa
   ```
2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
3. Set up the `.env.local` file. Copy `.env.example` (if available) or refer to the `README.md` to configure your Supabase keys and SMTP details.
4. Run the development server:
   ```bash
   pnpm run dev
   ```

### 2. Find an Issue or Propose a Change
- **Issues:** Look for open issues in the GitHub repository. Issues labeled `good first issue` or `help wanted` are great places to start.
- **Proposals:** If you have an idea for a new feature or architectural change, please open an issue first to discuss it with the maintainers.

### 3. Make Your Changes
1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```
2. Make your code changes.
3. Test your changes locally. If your change affects the mobile app UI or behavior, consider running the Capacitor build to verify:
   ```bash
   pnpm run build:capacitor
   npx cap sync android
   ```

### 4. Code Standards & Best Practices
- **TypeScript:** Use strict typing. Avoid `any` where possible.
- **Components:** Create reusable components inside the `components/` directory. Keep components small, focused, and purely functional if possible.
- **Next.js App Router:** Ensure you understand the difference between Server Components and Client Components (`"use client"`). Be very careful with `generateStaticParams()` as the app heavily relies on Static Exports (`output: 'export'`) for Capacitor builds.
- **Linting:** Run `pnpm run lint` before committing to ensure code style compliance.
- **Arabic First:** Hirfa is built for the Arabic-speaking world. Ensure UI text is properly translated, respects RTL layouts, and uses the correct terminology.

### 5. Commit Your Changes
We prefer conventional commit messages to keep the history clean and readable:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `style:` Changes that do not affect the meaning of the code (white-space, formatting)

Example:
```bash
git commit -m "feat: add user profile picture uploader"
```

### 6. Submit a Pull Request (PR)
1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the original repository.
3. In your PR description, clearly describe the problem you solved or the feature you added. Link to any relevant issues (e.g., "Closes #12").
4. The GitHub Actions CI pipeline will automatically run to verify that the project builds the Android APK correctly. Make sure all checks pass!

---

## 📱 Working with the Mobile App (Capacitor)
Since Hirfa is compiled into an APK using Capacitor, changes to routing or static generation can break the mobile build.

If you add a new dynamic route (e.g., `app/[id]/page.tsx`), you **must** ensure it works with Next.js static exports. 
- If it's a Server Component, export `generateStaticParams()`.
- If it's a Client Component, extract the client logic into a separate file (e.g., `ClientPage.tsx`), and let the `page.tsx` be a Server Component that exports `generateStaticParams()` and returns `<ClientPage />`.

*(If you are unsure, open a PR anyway and a maintainer will help you out!)*

---

## 💬 Community & Support
If you get stuck or have questions, feel free to open a Discussion on GitHub or reach out to the core team.

Thank you for making Hirfa better! ❤️
