# realmhdhasan-skills

Claude Code plugin marketplace by **realmhdhasan** — Bengali 2D cartoon
storytelling & explainer Reels, generated from an `.srt` voiceover.

## Install

In Claude Code, run these two commands:

```
/plugin marketplace add devmehedihasun/2d-animation-video-Claude-skill
```

```
/plugin install realmhdhasan-2d@realmhdhasan-skills
```

From your shell instead of inside a session:

```bash
claude plugin marketplace add devmehedihasun/2d-animation-video-Claude-skill
claude plugin install realmhdhasan-2d@realmhdhasan-skills
```

## Use

Give Claude a Bengali `.srt` and ask for a reel:

```
/realmhdhasan-2d:bangla-2d-reel
```

Or just attach the `.srt` and say what you want — the skill triggers on its own.

Claude reads the whole SRT, then asks **one** question covering three choices:

1. colour scheme (4–6 options)
2. character cast (2–3 outfit options per character)
3. subtitle mode — `1` = hook lines only, `2` = full word-by-word subtitles

Once you confirm all three it writes the complete Remotion project:
9:16, 1080×1920, 30fps, `durationInFrames` matched to the last SRT cue.

## What the skill enforces

- every character **front-facing**, both eyes on camera — no profile heads
- no flat fills: four-stop gradients with a 64% hold stop, AO wedges, rim light
- depth of field on wall props, sharp floor and foreground
- crisp gold `#F0C86A` Bengali type in Noto Serif Bengali — never red, never blurred
- offline fonts from npm, so a blocked Google CDN can't break a render
- one still per scene rendered and eyeballed before delivery

## What's in here

```
.claude-plugin/marketplace.json          the catalog
plugins/realmhdhasan-2d/
├── .claude-plugin/plugin.json           the manifest
└── skills/bangla-2d-reel/
    ├── SKILL.md                         the full production spec
    ├── docs/                            measured hex values, geometry, type references
    └── reference-project/               a working Remotion project
```

## Run the reference project

```bash
cd plugins/realmhdhasan-2d/skills/bangla-2d-reel/reference-project
npm install
npx remotion studio
```

## License

MIT
