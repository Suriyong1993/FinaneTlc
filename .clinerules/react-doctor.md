# React Doctor

Scan React code for security, performance, correctness, accessibility, bundle-size, and architecture issues. Outputs a 0–100 health score.

## When to use
After finishing a feature, fixing a bug, before committing React code, or when asked to scan / triage / clean up React diagnostics.

## After making React code changes
Run:

    npx react-doctor@latest --verbose --scope changed

Check the score did not regress. If it dropped, fix regressions before committing.

## Full cleanup
Run `npx react-doctor@latest --verbose` and fix by severity — errors first, then warnings.

Full skill (triage playbook + rule configuration): see `.clinerules/skills/react-doctor/SKILL.md`.
