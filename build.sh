#!/bin/sh

#deno run --no-check --unstable --allow-net --allow-read=. --allow-write=dist "https://raw.githubusercontent.com/ForestKatsch/apogee-ssg/main/src/main.ts"
#deno run --no-check --unstable --allow-net --allow-read=. --allow-write=dist "../../Software/Apogee/main.ts"
deno run --no-check --unstable -A "../../Software/Apogee/main.ts"
