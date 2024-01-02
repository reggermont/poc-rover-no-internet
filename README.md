# POC Rover no internet

This project aims to proove that Rover can't fully work without internet

## Requirements for Offline use

- [ ] Don't re-download plugins with rover

## How to test

- With internet, run `docker compose up -d` and wait for all service to be healthy
- Run `docker compose down` and shut off the internet
- Re-run `docker compose up -d` again and see if router can be healthy
