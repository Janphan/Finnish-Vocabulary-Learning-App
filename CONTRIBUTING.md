# Contributing to Finnish Vocabulary Learning App 🇫🇮

First off, thank you for considering contributing to this project! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## ⚡ Quick Start

1. **Fork** the repository to your GitHub account.
2. **Clone** the fork to your local machine.
3. **Install dependencies**: `npm install`
4. **Set up Environment**:
   - Rename `.env.example` to `.env`.
   - Add your own Firebase credentials (create a free project at [console.firebase.google.com](https://console.firebase.google.com)).
5. **Seed Demo Data**:
   - Run `npm run seed:demo` to populate your local Firestore with sample data.
   - _Note: Do not try to run the admin upload scripts without your own dataset._
6. **Start coding**: `npm run dev`

---

## 🚫 Important: Data & Privacy

This project follows a **"Code Public, Data Private"** model.

- **Do NOT commit large datasets** (JSON/CSV) to the repository.
- **Do NOT share your private Firebase Admin keys** in any PR.
- Develop using the **Sample Data** provided (`data/sample-vocabulary.json`).
- If your feature requires changes to the Data Schema, please discuss it in an Issue first.

---

## 🛠 Development Workflow

### 1. Branching

Create a new branch for your specific change. Avoid working directly on `main`.

- **Features:** `feature/my-new-feature`
- **Bug Fixes:** `fix/bug-description`
- **Docs:** `docs/update-readme`

### 2. Coding Standards

We use **TypeScript**, **React**, and **Tailwind CSS**.

- **TypeScript:** Avoid using `any`. Define interfaces in `src/types/`.
- **Styles:** Use Tailwind utility classes. Avoid inline `style={{ ... }}` unless necessary for dynamic values.
- **Components:** Use functional components and Hooks.
- **Linting:** Ensure your code passes linting before submitting.

### 3. Commit Messages

We encourage descriptive commit messages.

- Good: `feat: add swipe gesture for mobile navigation`
- Bad: `update code`

---

## 🐛 Reporting Bugs

Bugs happen! If you find one, please open an issue and include:

1. **Description**: What did you expect to happen, and what actually happened?
2. **Steps to Reproduce**: How can we see the bug ourselves?
   - _Example: "Go to Categories -> Click Animals -> Swipe Left"_
3. **Screenshots**: Visuals help us fix things faster.
4. **Environment**: Desktop/Mobile? Browser version?

---

## 🚀 Submitting a Pull Request (PR)

When you're ready to submit your changes:

1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch of this repository.
3. Fill out the PR template (describe your changes clearly).
4. **Link to Issues**: If this PR fixes a specific bug, type `Fixes #123`.

### PR Checklist

- [ ] My code runs locally without errors.
- [ ] I have tested the feature using the **Sample Data**.
- [ ] I have not committed any `.env` files or private keys.
- [ ] I have updated the README (if applicable).

---

## 🤝 Code of Conduct

This project is a welcoming space for learners and developers. Harassment or offensive behavior will not be tolerated. Be kind, be patient, and help each other learn!

Happy Coding! 🚀
