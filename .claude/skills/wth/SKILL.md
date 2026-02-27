---
name: wth
description: Git worktree管理。scripts/wthコマンドを使ったworktreeの追加・削除。Triggers on "/wth" or similar.
argument-hint: <add|rm> <name>
allowed-tools: Bash, Read, AskUserQuestion
---

# wth - Git Worktree管理スキル

`scripts/wth` コマンドを使ってgit worktreeの追加・削除を行う。

## 重要

- worktreeの追加・削除には **必ず `scripts/wth` コマンドを使う**こと
- `git worktree add/remove` を直接実行してはならない
- `EnterWorktree` ツールを使ってはならない

## コマンド

- `/wth add <name>` — worktreeを作成（ブランチ `wth/<name>`）
- `/wth rm <name>` — worktreeを削除（ブランチも削除）

## 引数の解析

`$ARGUMENTS` を以下のルールで解析する:

1. **`add <name>`**: worktreeを追加
2. **`rm <name>`**: worktreeを削除
3. **それ以外**: ヘルプを表示（`scripts/wth help` を実行）

## worktree追加 (`add`)

### 手順

1. `scripts/wth add <name>` を実行する
2. 成功したら、作成されたworktreeのパスとブランチ名をユーザーに報告する

### 実行例

```bash
scripts/wth add my-feature
```

出力:
```
[wth] creating worktree: /path/to/worktrees/my-feature (branch: wth/my-feature)
[wth] done: /path/to/worktrees/my-feature
```

## worktree削除 (`rm`)

### 手順

1. `AskUserQuestion` で削除の確認を行う
2. ユーザーが承認したら `scripts/wth rm <name>` を実行する
3. 成功したら、削除されたことをユーザーに報告する

### 実行例

```bash
scripts/wth rm my-feature
```

出力:
```
[wth] removing worktree: /path/to/worktrees/my-feature
[wth] deleting branch: wth/my-feature
[wth] done
```

## 環境変数

- `WTH_DIR` — worktreeのベースディレクトリを変更可能（デフォルト: `<project-root>/worktrees`）

## フック

`scripts/wth` は `.wth/hooks/` 配下のシェルスクリプトを自動実行する:

- `.wth/hooks/add/*.sh` — worktree作成後に実行
- `.wth/hooks/rm/*.sh` — worktree削除前に実行

フック内で使える環境変数: `WTH_NAME`, `WTH_BRANCH`, `WTH_PATH`, `WTH_PROJECT_ROOT`

## 注意事項

- **言語**: ユーザーの入力言語に合わせて応答する
- **削除時は必ず確認**: `rm` 実行前にユーザーに確認を取る
- **エラー時**: コマンドの出力をそのままユーザーに伝える
