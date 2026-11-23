# [MEPHEDRONE] desktop

The desktop app for [MEPHEDRONE](https://github.com/Shelf22/mephedrone), a privacy-first Discord client.
It's a fork of [Equibop](https://github.com/Equicord/Equibop), which is a fork of [Vesktop](https://github.com/Vencord/Vesktop).

Changes from Equibop:
- loads the bundled [MEPHEDRONE] client and never downloads code at runtime
- no auto-updater
- DevTools off in installed builds (start with `--devtools` to enable)
- cookie encryption on, true 1.0× scaling on Linux (`MEPH_SCALE=1.25` to change)

Downloads and docs: https://github.com/Shelf22/mephedrone

## Building

```sh
bun install
bun run package   # needs the client built at ../dist/equibop (see the main repo)
```

GPL-3.0-or-later.
