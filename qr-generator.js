/**
 * QR作成くん - QR生成
 * QRコード生成のコアロジック
 */

var QRGenerator = {
  /**
   * 現在のQRコードインスタンス
   */
  currentQR: null,

  /**
   * QRコード生成の共通処理
   * @param {string} data - QRコードに埋め込むデータ
   * @param {Object} options - QRコードのオプション（省略可）
   */
  generate: function (data, options) {
    var qrcodeDiv = document.getElementById(QRConfig.elements.qrcode);
    if (!qrcodeDiv) return;

    // optionsが未定義の場合は空オブジェクトを使用
    options = options || {};

    // デフォルト設定とマージ
    var settings = {
      width:
        options.size ||
        parseInt(document.getElementById(QRConfig.elements.qrSize).value, 10),
      height:
        options.size ||
        parseInt(document.getElementById(QRConfig.elements.qrSize).value, 10),
      colorDark:
        options.colorDark ||
        document.getElementById(QRConfig.elements.qrColorDark).value,
      colorLight:
        options.colorLight ||
        document.getElementById(QRConfig.elements.qrColorLight).value,
      correctLevel:
        QRCode.CorrectLevel[
          options.level ||
            document.getElementById(QRConfig.elements.qrLevel).value
        ],
    };

    // 既存のQRコードをクリア
    qrcodeDiv.innerHTML = "";

    // 新しいQRコードを生成
    try {
      this.currentQR = new QRCode(qrcodeDiv, {
        text: data,
        width: settings.width,
        height: settings.height,
        colorDark: settings.colorDark,
        colorLight: settings.colorLight,
        correctLevel: settings.correctLevel,
      });

      // 生成された文字列を表示
      this.updateQRText(data);
      return true;
    } catch (error) {
      console.error("QR generation error:", error);
      UIComponents.showMessage(
        "QRコードの生成に失敗しました。データ量が多すぎる可能性があります。",
        "error"
      );
      return false;
    }
  },

  /**
   * 定義IDから作成するQRコード生成
   * @param {Object} params - {defId, serverUrl, os, clusterParams}
   */
  generateDefIdQR: function (params) {
    var data = "";
    if (params.os === "ios") {
      var template = QRConfig.urlSchemes.ios.createReport;
      data = template
        .replace("{defid}", params.defId)
        .replace("{server}", encodeURIComponent(params.serverUrl));

      // クラスターパラメータを追加
      if (params.clusterParams) {
        data += params.clusterParams;
      }
    } else {
      var template = QRConfig.urlSchemes.windows.createReport;
      data = template.replace("{defid}", params.defId);
    }

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGenerated,
        "success"
      );
    }
  },

  /**
   * 帳票IDから開くQRコード生成
   * @param {Object} params - {repId, serverUrl, os}
   */
  generateRepIdQR: function (params) {
    var data = "";
    if (params.os === "ios") {
      var template = QRConfig.urlSchemes.ios.openReport;
      data = template
        .replace("{repid}", params.repId)
        .replace("{server}", encodeURIComponent(params.serverUrl));
    } else {
      var template = QRConfig.urlSchemes.windows.openReport;
      data = template.replace("{repid}", params.repId);
    }

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGenerated,
        "success"
      );
    }
  },

  /**
   * i-Reporter起動用QRコード生成
   * @param {string} os - 'ios' または 'windows'
   */
  generateLaunchQR: function (os) {
    var data =
      os === "ios"
        ? QRConfig.urlSchemes.ios.launch
        : QRConfig.urlSchemes.windows.launch;

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGeneratedLaunch,
        "success"
      );
    }
  },

  /**
   * クラスター値設定QRコード生成（iOSのみ）
   * @param {Array} pairs - [{name, value}] の配列
   */
  generateClusterQR: function (pairs) {
    var params = pairs
      .map(function (pair) {
        return (
          encodeURIComponent(pair.name) + "=" + encodeURIComponent(pair.value)
        );
      })
      .join("&");

    var template = QRConfig.urlSchemes.ios.setCluster;
    var data = template.replace("{params}", params);

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGeneratedCluster,
        "success"
      );
    }
  },

  /**
   * 帳票ダウンロードQRコード生成（iOSのみ）
   * @param {string} repIds - カンマ区切りの帳票ID
   */
  generateDownloadReportQR: function (repIds) {
    var template = QRConfig.urlSchemes.ios.downloadReport;
    var data = template.replace("{repids}", repIds.replace(/\s+/g, ""));

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGeneratedDownloadReport,
        "success"
      );
    }
  },

  /**
   * 定義ダウンロードQRコード生成（iOSのみ）
   * @param {string} defIds - カンマ区切りの定義ID
   */
  generateDownloadDefQR: function (defIds) {
    var template = QRConfig.urlSchemes.ios.downloadDefinition;
    var data = template.replace("{defids}", defIds.replace(/\s+/g, ""));

    if (this.generate(data, {})) {
      UIComponents.showMessage(
        QRConfig.messages.success.qrGeneratedDownloadDef,
        "success"
      );
    }
  },

  /**
   * QRテキストフィールドを更新
   * @param {string} text - 表示するテキスト
   */
  updateQRText: function (text) {
    var qrText = document.getElementById(QRConfig.elements.qrText);
    if (qrText) {
      qrText.value = text;
    }
  },

  /**
   * クラスターパラメータを構築
   * @param {string} rowsContainerId - クラスター行コンテナのID
   * @returns {string} URLパラメータ形式の文字列
   */
  buildClusterParams: function (rowsContainerId) {
    var container = document.getElementById(rowsContainerId);
    if (!container) return "";

    var rows = container.querySelectorAll(".flex");
    var params = [];

    for (var i = 0; i < rows.length; i++) {
      var nameInput = rows[i].querySelector(".defid-cluster-name");
      var valueInput = rows[i].querySelector(".defid-cluster-value");

      if (nameInput && valueInput) {
        var name = nameInput.value.trim();
        var value = valueInput.value.trim();

        if (name && value) {
          params.push(
            "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value)
          );
        }
      }
    }

    return params.join("");
  },

  /**
   * クラスターペアを取得
   * @param {string} rowsContainerId - クラスター行コンテナのID
   * @param {string} nameClass - 名前入力フィールドのクラス
   * @param {string} valueClass - 値入力フィールドのクラス
   * @returns {Array} [{name, value}] の配列
   */
  getClusterPairs: function (rowsContainerId, nameClass, valueClass) {
    var container = document.getElementById(rowsContainerId);
    if (!container) return [];

    var rows = container.querySelectorAll(".flex");
    var pairs = [];

    for (var i = 0; i < rows.length; i++) {
      var nameInput = rows[i].querySelector("." + nameClass);
      var valueInput = rows[i].querySelector("." + valueClass);

      if (nameInput && valueInput) {
        var name = nameInput.value.trim();
        var value = valueInput.value.trim();

        if (name && value) {
          pairs.push({ name: name, value: value });
        }
      }
    }

    return pairs;
  },
};
