# onezipp-team-dashboard

Small read-only status page for the Onezipp team. Static HTML/CSS/JS in `site/`, served by Caddy in one container, no database.

- `site/data.json` is a sanitized export. Anything that looks sensitive is replaced with "(redacted)".
- Login: HTTP basic auth, read from the environment (`DASH_USER`, `DASH_PASS_HASH`). No credentials are stored in this repository.
- Build: `docker build -t onezipp-team-dashboard .`
