const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");

async function importChapters() {
    const inputDir = path.resolve(__dirname, "chapitres");
    const outputBaseDir = path.resolve(__dirname, "../public/scans");

    const zipFiles = await fs.readdir(inputDir);

    for (const zipFile of zipFiles) {
        if (!zipFile.endsWith(".zip")) continue;

        const chapterMatch = zipFile.match(/chap(\d+)\.zip/);
        if (!chapterMatch) {
            console.warn(`Nom de fichier invalide : ${zipFile}`);
            continue;
        }

        const chapterNumber = chapterMatch[1];
        const zipPath = path.join(inputDir, zipFile);
        const outputDir = path.join(outputBaseDir, `chap${chapterNumber}`);

        await fs.ensureDir(outputDir);

        const zip = new AdmZip(zipPath);
        const entries = zip.getEntries();

        for (const entry of entries) {
            if (entry.isDirectory) continue;

            const originalName = path.basename(entry.entryName);

            if (originalName.toLowerCase().includes("default")) continue;

            // Match tous les groupes de chiffres dans le nom
            const allDigits = [...originalName.matchAll(/\d+/g)].map(m => m[0]);

            if (allDigits.length === 0 || !/\.(jpe?g|webp|png)$/i.test(originalName)) {
                console.log(`⛔ Fichier ignoré (nom invalide) : ${originalName}`);
                continue;
            }

            const lastDigits = allDigits[allDigits.length - 1]; // On garde le dernier
            const numericName = lastDigits.replace(/^0+/, "") || "0";
            const newFileName = `${numericName}.jpg`;
            const filePath = path.join(outputDir, newFileName);

            try {
                const imageBuffer = entry.getData();
                const ext = path.extname(originalName).toLowerCase();

                if (ext === ".png") {
                    const converted = await sharp(imageBuffer)
                        .jpeg({ quality: 90 })
                        .toBuffer();
                    await fs.writeFile(filePath, converted);
                } else {
                    await fs.writeFile(filePath, imageBuffer);
                }

                console.log(`→ ${originalName} enregistré en ${newFileName}`);
            } catch (err) {
                console.error(`Erreur lors de l'écriture de ${newFileName} :`, err);
            }
        }

        console.log(`✅ Chapitre ${chapterNumber} importé.`);
    }
}

importChapters().catch(console.error);
