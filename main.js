/**
 * QR作成くん - メイン
 * 初期化とイベントハンドラの設定
 */

var QRApp = {
  // アコーディオンコントロール
  accordions: {},

  /**
   * アプリケーションの初期化
   */
  init: function () {
    // DOMContentLoadedイベントで初期化
    document.addEventListener("DOMContentLoaded", this.onDOMReady.bind(this));
  },

  /**
   * DOM準備完了時の処理
   */
  onDOMReady: function () {
    // アコーディオンの初期化
    this.initAccordions();

    // モード切り替えの初期化
    this.initModeToggle();

    // OS切り替えの初期化
    this.initOSToggle();

    // メインボタンのイベント設定
    this.initMainButtons();

    // 上級者向け機能の初期化
    this.initAdvancedFeatures();

    // その他のイベント設定
    this.initMiscEvents();

    // 初期表示の更新
    this.updateMode();
    this.updateAdvancedVisibility();
  },

  /**
   * アコーディオンの初期化
   */
  initAccordions: function () {
    // 上級者向けパネル
    this.accordions.expert = UIComponents.createAccordion(
      "toggleExpert",
      "expertPanel",
      "expertChevron"
    );

    // QRコードカスタマイズ
    this.accordions.advanced = UIComponents.createAccordion(
      "toggleAdvanced",
      "advancedPanel",
      "advancedChevron"
    );

    // 定義用クラスター値
    this.accordions.defidCluster = UIComponents.createAccordion(
      "toggleDefidClusterAdvanced",
      "defid-cluster-advanced",
      "defidClusterChevron"
    );

    // ダウンロード機能
    this.accordions.download = UIComponents.createAccordion(
      "toggleDownloadAdvanced",
      "downloadPanel",
      "downloadChevron"
    );
  },

  /**
   * モード切り替えの初期化
   */
  initModeToggle: function () {
    var self = this;
    var modeInputs = ["mode-defid", "mode-repid", "mode-launch"];

    modeInputs.forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener("change", function () {
          self.updateMode();
          self.updateAdvancedVisibility();
        });
      }
    });
  },

  /**
   * OS切り替えの初期化
   */
  initOSToggle: function () {
    var self = this;
    var osInputs = ["os-ios", "os-windows"];

    osInputs.forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener("change", function () {
          self.updateAdvancedVisibility();
        });
      }
    });
  },

  /**
   * メインボタンのイベント設定
   */
  initMainButtons: function () {
    var self = this;

    // メイン生成ボタン
    var generateButton = document.getElementById("generateButton");
    if (generateButton) {
      generateButton.addEventListener("click", function () {
        self.handleMainGenerate();
      });
    }

    // 起動のみQR生成ボタン
    var generateLaunchQR = document.getElementById("generateLaunchQR");
    if (generateLaunchQR) {
      generateLaunchQR.addEventListener("click", function () {
        self.handleLaunchGenerate();
      });
    }

    // QRテキストコピーボタン
    var copyQRTextBtn = document.getElementById("copyQRText");
    if (copyQRTextBtn) {
      copyQRTextBtn.addEventListener("click", function () {
        self.handleCopyQRText();
      });
    }
  },

  /**
   * 上級者向け機能の初期化
   */
  initAdvancedFeatures: function () {
    var self = this;

    // クラスター値行追加ボタン（定義用）
    var addDefidClusterRow = document.getElementById("addDefidClusterRow");
    if (addDefidClusterRow) {
      addDefidClusterRow.addEventListener("click", function () {
        self.addDefidClusterRow();
      });
    }

    // ダウンロードQR生成ボタン
    var downloadButtons = [
      { id: "generateDownloadReportQR", handler: "handleDownloadReportQR" },
      { id: "generateDownloadDefQR", handler: "handleDownloadDefQR" },
    ];

    downloadButtons.forEach(function (btn) {
      var button = document.getElementById(btn.id);
      if (button) {
        button.addEventListener("click", function () {
          self[btn.handler]();
        });
      }
    });
  },

  /**
   * その他のイベント設定
   */
  initMiscEvents: function () {
    // 必要に応じて追加のイベントハンドラを設定
  },

  /**
   * 現在のモードを取得
   */
  getCurrentMode: function () {
    return {
      isDefid: document.getElementById("mode-defid").checked,
      isRepid: document.getElementById("mode-repid").checked,
      isLaunch: document.getElementById("mode-launch").checked,
    };
  },

  /**
   * 現在のOSを取得
   */
  getCurrentOS: function () {
    return document.querySelector('input[name="os"]:checked').value;
  },

  /**
   * モードに応じた表示を更新
   */
  updateMode: function () {
    var mode = this.getCurrentMode();

    UIComponents.toggleElements({
      "defid-input": mode.isDefid,
      "repid-input": mode.isRepid,
      launchOnlySection: mode.isLaunch,
      serverUrlSection: !mode.isLaunch,
      generateButton: !mode.isLaunch,
    });
  },

  /**
   * 上級者向け機能の表示制御
   */
  updateAdvancedVisibility: function () {
    var os = this.getCurrentOS();
    var mode = this.getCurrentMode();
    var isIOS = os === "ios";

    // 定義用クラスター値（iOSかつ定義IDモード）
    if (this.accordions.defidCluster) {
      this.accordions.defidCluster.setEnabled(isIOS && mode.isDefid);
    }

    // ダウンロード機能（iOSのみ）
    if (this.accordions.download) {
      this.accordions.download.setEnabled(isIOS);
    }
  },

  /**
   * メイン生成ボタンのハンドラ
   */
  handleMainGenerate: function () {
    // エラーをクリア
    UIComponents.clearFormErrors();

    // 入力値を取得
    var mode = this.getCurrentMode();
    var values = {
      serverUrl: document.getElementById("serverUrl").value.trim(),
      defId: document.getElementById("id").value.trim(),
      repId: document.getElementById("repid").value.trim(),
    };

    // バリデーション
    var errors = Validators.validateForm(mode, values);
    if (errors.length > 0) {
      UIComponents.showFormErrors(errors);
      return;
    }

    // QRコード生成
    var os = this.getCurrentOS();

    if (mode.isDefid) {
      var params = {
        defId: values.defId,
        serverUrl: values.serverUrl,
        os: os,
      };

      // iOSの場合、クラスターパラメータを追加
      if (os === "ios") {
        var clusterPanel = document.getElementById("defid-cluster-advanced");
        if (clusterPanel && clusterPanel.style.display !== "none") {
          params.clusterParams =
            QRGenerator.buildClusterParams("defidClusterRows");
        }
      }

      QRGenerator.generateDefIdQR(params);
    } else if (mode.isRepid) {
      QRGenerator.generateRepIdQR({
        repId: values.repId,
        serverUrl: values.serverUrl,
        os: os,
      });
    }
  },

  /**
   * 起動QR生成ハンドラ
   */
  handleLaunchGenerate: function () {
    var os = this.getCurrentOS();
    QRGenerator.generateLaunchQR(os);
  },

  /**
   * QRテキストコピーハンドラ
   */
  handleCopyQRText: function () {
    var qrText = document.getElementById("qrText");
    if (qrText) {
      qrText.select();
      document.execCommand("copy");
      UIComponents.showMessage(QRConfig.messages.success.textCopied, "success");
    }
  },

  /**
   * 定義用クラスター行を追加
   */
  addDefidClusterRow: function () {
    UIComponents.createDynamicRow("defidClusterRows", {
      placeholder1: "クラスター名",
      placeholder2: "値",
      value1: "",
      value2: "",
      class1: "defid-cluster-name",
      class2: "defid-cluster-value",
      removeButtonClass: "remove-defid-cluster-row",
    });
  },

  /**
   * 帳票ダウンロードQR生成ハンドラ
   */
  handleDownloadReportQR: function () {
    var repIds = document.getElementById("downloadRepid").value.trim();

    if (!repIds) {
      UIComponents.showMessage(
        QRConfig.messages.error.downloadRepIdRequired,
        "error"
      );
      return;
    }

    if (!Validators.validateIdList(repIds)) {
      UIComponents.showMessage("帳票IDの形式が正しくありません", "error");
      return;
    }

    QRGenerator.generateDownloadReportQR(repIds);
  },

  /**
   * 定義ダウンロードQR生成ハンドラ
   */
  handleDownloadDefQR: function () {
    var defIds = document.getElementById("downloadDefid").value.trim();

    if (!defIds) {
      UIComponents.showMessage(
        QRConfig.messages.error.downloadDefIdRequired,
        "error"
      );
      return;
    }

    if (!Validators.validateIdList(defIds)) {
      UIComponents.showMessage("定義IDの形式が正しくありません", "error");
      return;
    }

    QRGenerator.generateDownloadDefQR(defIds);
  },
};

// アプリケーションを初期化
QRApp.init();
