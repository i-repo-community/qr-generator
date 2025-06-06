/**
 * QR作成くん - 設定ファイル
 * このファイルで各種デフォルト値やメッセージを管理します
 */

var QRConfig = {
  // QRコードのデフォルト設定
  qr: {
    defaultSize: 256,
    defaultLevel: "H",
    defaultColorDark: "#ea580c",
    defaultColorLight: "#ffffff",
    sizes: [
      { value: 200, label: "小（200px）" },
      { value: 256, label: "中（256px）" },
      { value: 320, label: "大（320px）" },
      { value: 512, label: "特大（512px）" },
    ],
    levels: [
      { value: "L", label: "L（7%）" },
      { value: "M", label: "M（15%）" },
      { value: "Q", label: "Q（25%）" },
      { value: "H", label: "H（30%）" },
    ],
  },

  // メッセージ
  messages: {
    success: {
      qrGenerated: "QRコードが生成されました！",
      qrGeneratedCluster: "クラスター値QRコードが生成されました！",
      qrGeneratedDownloadReport: "帳票DL用QRコードが生成されました！",
      qrGeneratedDownloadDef: "定義DL用QRコードが生成されました！",
      qrGeneratedLaunch: "i-Reporter起動用QRコードが生成されました！",
      textCopied: "文字列をコピーしました！",
    },
    error: {
      serverUrlRequired: "サーバーURLを入力してください。",
      serverUrlInvalid: "サーバーURLの形式が正しくありません。",
      defIdRequired: "定義IDを入力してください。",
      defIdInvalid: "定義IDは正の整数で入力してください。",
      repIdRequired: "帳票IDを入力してください。",
      repIdInvalid: "帳票IDは正の整数で入力してください。",
      clusterRequired: "クラスター名と値を1つ以上入力してください",
      downloadRepIdRequired: "帳票IDを1つ以上入力してください",
      downloadDefIdRequired: "定義IDを1つ以上入力してください",
    },
  },

  // URLスキームテンプレート
  urlSchemes: {
    ios: {
      createReport:
        "jp.co.cimtops.ireporter.createreport:defid={defid}&server={server}",
      openReport:
        "jp.co.cimtops.ireporter.openreport:repid={repid}&server={server}",
      setCluster: "jp.co.cimtops.ireporter.setcluster:{params}",
      downloadReport: "jp.co.cimtops.ireporter.downloadreport:repid={repids}",
      downloadDefinition:
        "jp.co.cimtops.ireporter.downloaddefinition:defid={defids}",
      launch: "jp.co.cimtops.ireporter://open",
    },
    windows: {
      createReport: "ireporter.createreport:defid={defid}",
      openReport: "ireporter.openreport:repid={repid}",
      launch: "ireporter://open",
    },
  },

  // UI要素のID
  elements: {
    // モード選択
    modeDefid: "mode-defid",
    modeRepid: "mode-repid",
    modeLaunch: "mode-launch",

    // 入力フィールド
    defidInput: "defid-input",
    repidInput: "repid-input",
    launchOnlySection: "launchOnlySection",
    serverUrlSection: "serverUrlSection",

    // QR設定
    qrSize: "qrSize",
    qrLevel: "qrLevel",
    qrColorDark: "qrColorDark",
    qrColorLight: "qrColorLight",

    // ボタン
    generateButton: "generateButton",
    generateLaunchQR: "generateLaunchQR",

    // 結果表示
    qrcode: "qrcode",
    result: "result",
    qrText: "qrText",

    // エラー表示
    formError: "formError",
  },
};
