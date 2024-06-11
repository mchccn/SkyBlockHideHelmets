import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const root = "assets/notenoughupdates/custom_skull_textures/helmets";

const entries = await fs.readdir(root, { withFileTypes: true });

for (const entry of entries) {
    if (entry.isDirectory() || !entry.name.endsWith(".png")) continue;

    const file = path.join(root, entry.name);

    const metadata = await sharp(file).metadata();

    await fs.writeFile(
        file,
        await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .png()
            .toBuffer()
    );

    console.log(`wiped ${file}`);
}
