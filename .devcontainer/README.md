# Dev Container セットアップ

## 初回セットアップ

コンテナが起動したら、以下の手順でセットアップしてください。

### 1. mise install

ツールチェインをインストールします。

```bash
mise install
```

### 2. chezmoi の適用（任意）

chezmoi で dotfiles を管理している場合は先に適用してください。

```bash
mise exec chezmoi -- chezmoi apply
```
