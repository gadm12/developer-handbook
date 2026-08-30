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
      dir('server', [file('.env'), file('.dockerignore'), file('Dockerfile')]),
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
      'A Django project with one app already broken out. `startproject` and `startapp` generate most of this — use it to see the shape before you run them.',
    tree: dir('server', [
      dir('server', [
        file('__init__.py'),
        file('settings.py'),
        file('urls.py'),
        file('wsgi.py'),
        file('asgi.py'),
      ]),
      dir('user_app', [
        dir('migrations', [file('__init__.py')]),
        dir('fixtures', [file('user_data.json')]),
        file('__init__.py'),
        file('admin.py'),
        file('apps.py'),
        file('models.py'),
        file('serializers.py'),
        file('urls.py'),
        file('views.py'),
        file('tests.py'),
      ]),
      file('manage.py'),
      file('requirements.txt'),
      file('.env'),
      file('.env.example'),
      file('.dockerignore'),
      file('Dockerfile'),
    ]),
  },
  {
    id: 'react-client',
    label: 'React Client',
    description:
      'A Vite React client with routing, Cypress, and the folders worth creating up front. `npm create vite@latest` gives you a thinner version of this.',
    tree: dir('client', [
      dir('public', [file('favicon.svg')]),
      dir('src', [
        dir('assets', []),
        dir('components', [file('NavBar.jsx')]),
        dir('pages', [file('Home.jsx')]),
        file('main.jsx'),
        file('App.jsx'),
        file('router.jsx'),
        file('utilities.js'),
        file('index.css'),
      ]),
      dir('cypress', [dir('e2e', [file('smoke.cy.js')])]),
      file('index.html'),
      file('package.json'),
      file('vite.config.js'),
      file('eslint.config.js'),
      file('.env'),
      file('.dockerignore'),
      file('Dockerfile'),
    ]),
  },
]
