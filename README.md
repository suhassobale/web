# myapp

Minimal Express + MySQL (RDS) app used to test a load-balanced, auto-scaled EC2 setup.

## Routes

- `GET /` — health check (what the target group polls)
- `GET /test-insert` — inserts a row into `test_table` and returns the last 10 rows, tagged with the hostname of whichever server handled the request

## Local / manual server setup

```bash
npm install
cp .env.example .env   # then fill in real RDS credentials
npm start
```

## EC2 launch template

`scripts/user-data.sh` is the User Data script for the Launch Template. It installs Node,
clones this repo, writes `.env`, installs dependencies, and starts the app under pm2 —
so a new instance is fully configured and serving traffic with no manual SSH step.

Before pasting it into the Launch Template, update:
- the `git clone` URL to point at this repo
- the `.env` heredoc values to your real RDS endpoint/credentials
