## Directory-Based Configuration

Cline Rules allow you to provide Cline with system-level guidance using a folder-based approach. The `.clinerules/` directory contains Markdown files that are automatically processed by Cline. This system enables better organization and management of rules.

## Creating .clinerules/ Directory

To set up the directory structure:

```bash
# Create directory structure
mkdir .clinerules

# Create initial files
touch .clinerules/01-project-overview.md
touch .clinerules/02-coding-standards.md
touch .clinerules/03-testing.md
touch .clinerules/04-deployment.md
```

## File Naming Convention

Pattern: [number]-[description].md

All files in `.clinerules/` MUST be Markdown (.md) files. Cline automatically processes all Markdown files in the directory.

Numbering scheme:

01-09: Core rules (always relevant)
10-19: Language/framework rules
20-29: Advanced patterns
30-39: Team-specific conventions

Example structure:

```
.clinerules/
├── 01-project-overview.md       # Always loaded first (core)
├── 02-architecture.md           # Structural patterns (core)
├── 03-testing.md                # Testing standards (core)
├── 04-deployment.md             # Deployment process (core)
├── 10-typescript-rules.md       # TypeScript guidelines (language/framework)
├── 11-react-patterns.md         # React patterns (language/framework)
├── 12-api-conventions.md        # API conventions (language/framework)
├── 13-database-patterns.md      # Database patterns (language/framework)
├── 20-testing-guide.md          # Advanced testing (advanced)
├── 21-security-checklist.md     # Security requirements (advanced)
└── 30-team-conventions.md       # Team-specific rules (team-specific)
```

## Rules Bank (.cline-rules-bank/)

For projects with multiple contexts or teams, maintain a rules bank directory to store inactive rules. Files in the rules bank follow the same numbering scheme to maintain consistency when activating rules.

```
.cline-rules-bank/          # Repository of available but inactive rules
├── clients/                      # Client-specific rule sets (30-39)
│   ├── 30-client-a.md
│   └── 31-client-b.md
├── frameworks/                   # Framework-specific rules (10-19)
│   ├── 10-react.md
│   └── 11-vue.md
└── project-types/                # Project type standards (20-29)
    ├── 20-api-service.md
    └── 21-frontend-app.md
```

To activate rules, copy them to `.clinerules/`:

```bash
# Switch to Client B project
rm .clinerules/30-client-a.md
cp .cline-rules-bank/clients/31-client-b.md .clinerules/

# Add React framework rules
cp .cline-rules-bank/frameworks/10-react.md .clinerules/
```

This approach allows contextual activation of rules without cluttering the active ruleset.

For more details, refer to the official Cline Rules documentation: https://docs.cline.bot/features/cline-rules
