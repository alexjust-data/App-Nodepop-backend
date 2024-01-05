// cargar librería i18n
const i18n = require('i18n');
const path = require('node:path');

// configurar mi instancia de i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true, // watch for changes in JSON files to reload locale on updates - defaults to false
  syncFiles: true, // sync locale information across all files - defaults to false
  cookie: 'nodeapp-locale'
});

// para utilizar en scripts
i18n.setLocale('en');

// exportar
module.exports = i18n