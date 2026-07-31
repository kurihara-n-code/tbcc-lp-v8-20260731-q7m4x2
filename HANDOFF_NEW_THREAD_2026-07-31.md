# TBCC LP V7 引き継ぎ書（2026-07-31）

## 作業対象

- 作業フォルダ: `S:\マイドライブ\Opus Works\TBCC LP\tbcc-lp-v7-design_seitai-logo-version`
- 主なファイル: `index.html` / `styles.css` / `content.js` / `app.js`
- 静的LPです。編集対象以外のデザイン・文言は変更しないこと。

## 公開先

現在の公開先（別アドレス）:

`https://kurihara-n-code.github.io/tbcc-lp-v7-design_seitai-logo-version-R4mN8xQ2Za/`

- Git remote `alternate`: 上記公開先のGitHubリポジトリ
- Git remote `origin`: 旧公開先（`tbcc-lp-v7-design_seitai-logo-version-qSx8wzztn5`）
- 現在の `main` は `alternate/main` を追跡
- 最新公開コミット: `c2923ce Adjust seminar mobile heading spacing`
- GitHub Pages の最新ビルド完了と HTTP 200 は確認済み

## 直近の変更

スマホ版の「国家資格者や独立開業者を対象としたセミナー」見出し:

- 改行位置: 「国家資格者や独立開業者を」の直後
- `styles.css` のモバイル指定: `.seminar-course-block .sub-course-intro h3 { font-size: 19px; line-height: .8; }`

## 未追跡ファイル

以下は公開対象外で、サイトから参照されていません。コミット・アップロードしないこと。

- `tbcc-qualifications-pc.png`
- `tbcc-qualifications-sp.png`

## GTMについて

ユーザーから次のGoogle Tag Managerタグが提供されていますが、現時点では未実装です。

- コンテナID: `GTM-N3LWXKG5`
- 実装時は `head.txt` のscriptを`<head>`開始直後へ、`body.txt`のnoscriptを`<body>`開始直後へ入れる
- 本番サーバーは他社管理。Codex側でタグ入りの静的ファイル一式またはZIPを作成し、管理会社にアップロードしてもらうことは可能
- 本番サーバーへの直接アップロードはしない

## 作業時の注意

- 「アップして」と明示されるまで、GitHubへのコミット・push・Pages公開は行わない
- スクリーンショット指定の変更は、該当箇所以外を維持する
- PC/スマホの確認は区別して報告する。ソース確認のみの場合、実ブラウザでの視覚確認済みとは言わない
- CSS/JSを編集した場合は、必要に応じて`index.html`内のキャッシュバスターを更新する