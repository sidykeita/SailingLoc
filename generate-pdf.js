// Utilisation des imports ES
import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Options pour la génération du PDF
const options = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '20mm',
    bottom: '20mm',
    left: '20mm'
  },
  printBackground: true
};

// Chemin vers le fichier HTML
const htmlFilePath = path.join(__dirname, 'devis-sailingloc.html');

// Lecture du fichier HTML
fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier HTML:', err);
    return;
  }

  // Création du fichier PDF
  const file = { content: htmlContent };
  
  htmlPdf.generatePdf(file, options)
    .then(pdfBuffer => {
      // Écriture du fichier PDF
      const pdfFilePath = path.join(__dirname, 'devis-sailingloc.pdf');
      fs.writeFile(pdfFilePath, pdfBuffer, (err) => {
        if (err) {
          console.error('Erreur lors de l\'écriture du fichier PDF:', err);
          return;
        }
        console.log(`Le fichier PDF a été généré avec succès: ${pdfFilePath}`);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la génération du PDF:', error);
    });
});
