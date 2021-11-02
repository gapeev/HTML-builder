const { readdir, stat } = require('fs/promises');
const { resolve: resolvePath, parse: parsePath } = require('path');

(async () => {
  const foldername = 'secret-folder';
  const entries = await readdir(resolvePath(__dirname, foldername), {
    withFileTypes: true,
  });
  const files = entries.filter((entry) => entry.isFile());
  const statPromises = files.map(({ name }) =>
    stat(resolvePath(__dirname, foldername, name))
  );
  const stats = await Promise.all(statPromises);
  stats.forEach(({ size }, index) => {
    const { name, ext } = parsePath(files[index].name);
    console.log(`${name} - ${ext.substring(1)} - ${size}`);
  });
})();
