async function importAllChapters() {
  const inputFolder = path.resolve(__dirname, "chapitres");

  if (!(await fs.pathExists(inputFolder))) {
    console.error(`❌ Le dossier ${inputFolder} n'existe pas.`);
    return;
  }

  const files = await fs.readdir(inputFolder);
  for (const file of files) {
    if (file.endsWith(".zip")) {
      const chapterNumberMatch = file.match(/\d+/);
      if (!chapterNumberMatch) {
        console.warn(`⚠️ Impossible de trouver le numéro de chapitre dans le fichier ${file}.`);
        continue;
      }

      const chapterNumber = chapterNumberMatch[0];
      const zipPath = path.join(inputFolder, file);

      console.log(`📦 Importation du chapitre ${chapterNumber} depuis ${file}...`);
      await importChapter(zipPath, chapterNumber);
    }
  }

  console.log("✅ Importation de tous les chapitres terminée.");
}
