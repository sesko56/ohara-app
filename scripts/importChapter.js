const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs-extra");

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

      // Ignorer les fichiers contenant "default"
      if (originalName.toLowerCase().includes("default")) continue;

      // Ne garder que les fichiers nommés par un chiffre (ex: 01.jpg, 2.webp)
      const validNameMatch = originalName.match(/^0*(\d+)\.(jpg|webp)$/i);
      if (!validNameMatch) {
        console.log(`⛔ Fichier ignoré (nom invalide) : ${originalName}`);
        continue;
      }

      // Retirer les zéros en début et forcer .jpg
      const numericName = validNameMatch[1];
      const newFileName = `${numericName}.jpg`;
      const filePath = path.join(outputDir, newFileName);

      try {
        await fs.writeFile(filePath, entry.getData());
        console.log(`→ ${originalName} enregistré en ${newFileName}`);
      } catch (err) {
        console.error(`Erreur lors de l'écriture de ${newFileName} :`, err);
      }
    }

    console.log(`✅ Chapitre ${chapterNumber} importé.`);
  }
}

importChapters().catch(console.error);
