// Scaffold starter trees. Add an entry here and it shows up as a tab — no UI
// code to touch.
//
// Node shape: { name, type: 'dir' | 'file', children? }

const dir = (name, children = []) => ({ name, type: 'dir', children })
const file = (name) => ({ name, type: 'file' })

export const presets = [
  {
    id: 'fullstack-root',
    label: 'Full Stack Root',
    description:
      'Django + React + Postgres + Redis behind one compose stack. Mirrors the layout the dev and prod compose files in the Docker guide expect.',
    tree: dir('root', [
      dir('client', [
        dir('nginx', [file('default.conf')]),
        file('.dockerignore'),
        file('Dockerfile'),
      ]),
      dir('server', [
        file('.env'),
        file('.env.example'),
        file('.dockerignore'),
        file('Dockerfile'),
      ]),
      dir('db', [file('.dockerignore'), file('Dockerfile')]),
      file('docker-compose.yml'),
      file('docker-compose.prod.yml'),
      file('Makefile'),
      file('.gitignore'),
      file('README.md'),
    ]),
  },
  {
    id: 'django-app',
    label: 'Django App',
    description:
      'The files startapp does not give you, plus a tests folder. Rename name_app and test_001.py in place — one generate creates both folders at once.',
    tree: dir('root', [
      dir('server', [
        dir('name_app', [
          file('serializers.py'),
          file('validators.py'),
          file('urls.py'),
        ]),
        dir('tests', [file('test_001.py')]),
      ]),
    ]),
  },
  {
    id: 'react-client',
    label: 'React Client',
    description:
      'One component folder with colocated styles, plus the Cypress e2e folder. Rename Navbar to whatever you are building and generate.',
    tree: dir('root', [
      dir('client', [
        dir('cypress', [dir('e2e', [file('001-place-holder.cy.js')])]),
        dir('src', [
          dir('Components', [
            dir('Navbar', [
              file('Navbar.jsx'),
              file('index.js'),
              dir('styles', [file('styles.css'), file('tailwindStyles.js')]),
            ]),
          ]),
        ]),
      ]),
    ]),
  },
]
