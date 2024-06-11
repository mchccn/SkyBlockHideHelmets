import { createWriteStream, existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";

const root = "assets/notenoughupdates/custom_skull_textures/helmets";
const repo = "NotEnoughUpdates-REPO/items";

const { items } = JSON.parse(await fs.readFile("items.json", "utf8"));

const helmets = [];

for (const item of items) {
    if (item.category !== "HELMET") continue;

    helmets.push(item);
}

helmets.sort((a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
});

const json = {};

for (const helmet of helmets) {
    if (!helmet.skin) continue;

    if (!existsSync(path.join(repo, helmet.id + ".json"))) continue;

    const uuid = JSON.parse(await fs.readFile(path.join(repo, helmet.id + ".json"), "utf8")).nbttag.match(/SkullOwner:{Id:"([^"]+?)"/)?.[1];

    if (!uuid) continue;

    const texture = new URL(JSON.parse(atob(helmet.skin)).textures.SKIN.url);

    const stream = createWriteStream(path.join(root, helmet.id.toLowerCase() + ".png"));
    const { body } = await fetch(texture);
    await finished(Readable.fromWeb(body).pipe(stream));

    console.log(`wrote ${helmet.id}`);

    json[uuid] = { texture: "helmets/" + helmet.id.toLowerCase() };
}

await fs.writeFile(path.join(root, "..", "customskull.json"), JSON.stringify(json, null, 4));

console.log(`done`);
