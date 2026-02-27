## パッケージ構成

```
apps/
└── web/                                         # TanStack Start / Cloudflare Workers

packages/
├── contracts/                                   # bounded contextの外側に対する契約API
│   ├── shared-kernel-public/
│   │   └── src/
│   │       ├── events.ts
│   │       ├── commands.ts
│   │       ├── queries.ts
│   │       └── index.ts
│   ├── shared-kernel-server/
│   │   └── src/
│   │       ├── command-bus.ts
│   │       ├── query-bus.ts
│   │       ├── event-bus.ts                     # 各BCのevent-busのmarker interface
│   │       └── index.ts
│   ├── <bc>-public/                             # BCの契約。client/server問わず参照可能
│   │   └── src/
│   │       ├── events.ts
│   │       ├── commands.ts
│   │       ├── queries.ts
│   │       └── index.ts
│   └── <bc>-server/                             # BCの契約。serverから参照可能
│       └── src/
│           ├── <bc>-command-bus.ts
│           ├── <bc>-query-bus.ts
│           ├── <bc>-event-bus.ts
│           └── index.ts
│
├── modules/                                     # bounded contextの内部実装
│   ├── shared-kernel-write-application/
│   │   └── src/
│   ├── shared-kernel-write-model/
│   │   └── src/
│   ├── shared-kernel-read-application/
│   │   └── src/
│   ├── shared-kernel-read-model/
│   │   └── src/
│   ├── <bc>-write-application/
│   │   └── src/
│   │       ├── handlers/
│   │       └── <bc>-command-bus-impl.ts
│   ├── <bc>-write-model/
│   │   └── src/
│   ├── <bc>-write-infra/
│   │   └── src/
│   ├── <bc>-read-application/
│   │   └── src/
│   │       ├── handlers/
│   │       └── <bc>-query-bus-impl.ts
│   ├── <bc>-read-model/
│   │   └── src/
│   └── <bc>-read-infra/
│       └── src/
│
├── platform/                                    # 特定のinfra固有の処理。modules/*-infra/から参照される
│   └── db/                                      # 初期はDB共有でスタート
│       └── src/
│
└── lib/                                         # ドメイン知識のない共通処理や型
    ├── public/
    │   └── src/
    └── server/
        └── src/
```

## パッケージリスト

| パス | パッケージ名 | 説明 |
|------|-------------|------|
| `apps/web` | - | TanStack Start / Cloudflare Workers |
| `packages/contracts/shared-kernel-public` | `@contracts/shared-kernel-public` | ドメイン知識を伴う共通の型。client/server参照可 |
| `packages/contracts/shared-kernel-server` | `@contracts/shared-kernel-server` | ドメイン知識を伴う共通の型。server参照可 |
| `packages/contracts/<bc>-public` | `@contracts/<bc>-public` | BCの契約。client/server参照可 |
| `packages/contracts/<bc>-server` | `@contracts/<bc>-server` | BCの契約。server参照可 |
| `packages/modules/shared-kernel-write-application` | `@modules/shared-kernel-write-application` | shared-kernel write側application層 |
| `packages/modules/shared-kernel-write-model` | `@modules/shared-kernel-write-model` | shared-kernel write側model層 |
| `packages/modules/shared-kernel-read-application` | `@modules/shared-kernel-read-application` | shared-kernel read側application層 |
| `packages/modules/shared-kernel-read-model` | `@modules/shared-kernel-read-model` | shared-kernel read側model層 |
| `packages/modules/<bc>-write-application` | `@modules/<bc>-write-application` | BC write側application層 |
| `packages/modules/<bc>-write-model` | `@modules/<bc>-write-model` | BC write側model層 |
| `packages/modules/<bc>-write-infra` | `@modules/<bc>-write-infra` | BC write側infra層 |
| `packages/modules/<bc>-read-application` | `@modules/<bc>-read-application` | BC read側application層 |
| `packages/modules/<bc>-read-model` | `@modules/<bc>-read-model` | BC read側model層 |
| `packages/modules/<bc>-read-infra` | `@modules/<bc>-read-infra` | BC read側infra層 |
| `packages/platform/db` | `@platform/db` | DB共通処理 |
| `packages/lib/public` | `@lib/public` | ドメイン知識のない共通処理。client/server参照可 |
| `packages/lib/server` | `@lib/server` | ドメイン知識のない共通処理。server参照可 |

## 依存ルール

- 各パッケージはTSのままexportし、依存は全てpeerDependencies。apps/webのビルド時に解決
- 依存の制限はpackage.jsonで管理

### レイヤー間

- application → model : OK
- model → application : NG
- infra → application, model : OK
- application, model → infra : NG

### BC間

- BC間の参照は contracts/* のみ許可
- modules/<bc-A>-* → modules/<bc-B>-* : NG（直接参照禁止）
- modules/<bc-A>-* → contracts/<bc-B>-* : OK

### platform

- modules/*-infra → platform/* : OK
- platform/* → modules/** : NG
