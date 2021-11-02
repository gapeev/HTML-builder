const {
  rm,
  mkdir,
  readFile,
  writeFile,
  readdir,
  copyFile,
} = require('fs/promises');
const { resolve: resolvePath, join: joinPath, extname } = require('path');

const bundleMarkup = async (
  templateSrc,
  componentsSrc,
  dist,
  target = 'index.html'
) => {
  const template = await readFile(resolvePath(__dirname, templateSrc), 'utf8');
  const components = template.match(/(?<={{)[^}]*(?=}})/g);
  const componentsMarkup = await Promise.all(
    components.map((component) =>
      readFile(resolvePath(__dirname, componentsSrc, `${component}.html`))
    )
  );
  const markup = components.reduce(
    (bundle, component, index) =>
      bundle.replace(`{{${component}}}`, componentsMarkup[index]),
    template
  );
  writeFile(resolvePath(__dirname, dist, target), markup);
};

const bundleStyles = async (stylesSrc, dist, target = 'style.css') => {
  const entries = await readdir(resolvePath(__dirname, stylesSrc), {
    withFileTypes: true,
  });
  const cssFiles = entries
    .filter((entry) => entry.isFile())
    .filter(({ name }) => extname(name) === '.css');
  const data = await Promise.all(
    cssFiles.map(({ name }) =>
      readFile(resolvePath(__dirname, stylesSrc, name), 'utf8')
    )
  );
  writeFile(resolvePath(__dirname, dist, target), data.join('\n'));
};

const copyAssets = async (assetsSrc, dist) => {
  const entries = await readdir(resolvePath(__dirname, assetsSrc), {
    withFileTypes: true,
  });
  const files = entries.filter((entry) => entry.isFile());
  const directories = entries.filter((entry) => entry.isDirectory());
  await mkdir(resolvePath(__dirname, dist, assetsSrc), { recursive: true });
  Promise.all(
    files.map(({ name }) =>
      copyFile(
        resolvePath(__dirname, assetsSrc, name),
        resolvePath(__dirname, dist, assetsSrc, name)
      )
    )
  );
  Promise.all(
    directories.map(({ name }) => copyAssets(joinPath(assetsSrc, name), dist))
  );
};

(async () => {
  const dist = 'project-dist';
  await rm(resolvePath(__dirname, dist), {
    recursive: true,
    force: true,
  });
  await mkdir(resolvePath(__dirname, dist), { recursive: true });
  bundleMarkup('template.html', 'components', dist);
  bundleStyles('styles', dist);
  copyAssets('assets', dist);
})();
