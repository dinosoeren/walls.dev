# walls.dev

- **SSG**: [Hugo](https://gohugo.io/getting-started/quick-start/)
- **Theme**: [Anatole](https://github.com/lxndrblz/anatole/wiki) ([*forked*](https://github.com/dinosoeren/anatole))
- **CMS**: [Decap](https://github.com/decaporg/decap-cms)

## Local

```bash
hugo server -D # include drafts
```

`static/admin/config.yml`
```yaml
local_backend: true
```

```bash
npx decap-server # local CMS
```

## Deploy

```bash
hugo
```
