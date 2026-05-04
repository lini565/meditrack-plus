# 📝 Git Commands Quick Reference

## Initial Setup (One Time)

```bash
# Initialize Git
git init

# Check status
git status

# Add all files
git add .

# First commit
git commit -m "Initial Next.js setup with MediTrack+ features"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/meditrack-plus.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Regular Workflow (After Each Feature)

```bash
# 1. Make changes to code...

# 2. Check what changed
git status

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "Add feature description"

# 5. Push to GitHub (Vercel auto-deploys!)
git push
```

## Commit Message Examples

### Step 1: Home Page
```bash
git commit -m "Create MediTrack+ home page with features"
```

### Step 2: Add Medicine Form
```bash
git commit -m "Add medicine form UI and validation"
```

### Step 3: Supabase Integration
```bash
git commit -m "Integrate Supabase client and types"
```

### Step 4: API Routes
```bash
git commit -m "Create API routes for medicines (GET, POST, DELETE)"
```

### Step 5: Dashboard
```bash
git commit -m "Build dashboard with medicine list and reminders"
```

### Step 6: Reminder System
```bash
git commit -m "Add reminder system with browser notifications"
```

### Step 7: Pharmacy Locator
```bash
git commit -m "Add pharmacy locator with geolocation"
```

## Useful Commands

```bash
# See commit history
git log

# See last 5 commits
git log -5 --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard changes to a file
git checkout -- filename.tsx

# See changes made
git diff

# See changes in staged files
git diff --cached

# Remove file from staging
git restore --staged filename.tsx

# Create new branch
git checkout -b feature/new-feature-name

# Switch between branches
git checkout main
git checkout feature/new-feature-name

# Merge branch into main
git checkout main
git merge feature/new-feature-name

# Delete branch
git branch -d feature/new-feature-name

# See all branches
git branch -a

# Push specific branch
git push origin feature/new-feature-name

# Create pull request on GitHub
# (After pushing to GitHub, GitHub will show "Compare & pull request" button)
```

## When Something Goes Wrong

```bash
# Undo the last commit (keep files)
git reset --soft HEAD~1

# Undo the last commit (discard changes)
git reset --hard HEAD~1

# Undo all changes since last commit
git reset --hard

# Revert to a specific commit
git revert <commit-hash>

# See what branch you're on
git branch

# Check remote URL
git remote -v
```

## GitHub Workflow (Best Practices)

```bash
# Create feature branch
git checkout -b feature/add-notifications

# Make changes...
git add .
git commit -m "Add notification feature"

# Push feature branch
git push origin feature/add-notifications

# Go to GitHub → Click "Compare & pull request"
# (Add description and submit PR)
# Merge PR on GitHub

# Back to local machine
git checkout main
git pull

# Delete old branch
git branch -d feature/add-notifications
```

## Ignore Files (.gitignore)

Already configured to ignore:
- `.env.local` (your secrets)
- `node_modules/` (dependencies)
- `.next/` (build output)
- `.DS_Store` (Mac files)

---

**Pro Tips:**
- Commit early and often with descriptive messages
- One feature = one commit
- Always pull before pushing: `git pull` then `git push`
- Use branches for new features: `git checkout -b feature/name`
