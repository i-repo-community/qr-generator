/**
 * QR作成くん - バリデーション
 * フォーム入力値の検証機能
 */

var Validators = {
  /**
   * サーバーURLの検証
   * @param {string} url - 検証するURL
   * @returns {string|null} エラーメッセージまたはnull
   */
  validateServerUrl: function (url) {
    if (!url || url.trim() === "") {
      return QRConfig.messages.error.serverUrlRequired;
    }
    if (!/^https?:\/\/.+/.test(url)) {
      return QRConfig.messages.error.serverUrlInvalid;
    }
    return null;
  },

  /**
   * 定義IDの検証
   * @param {string} id - 検証するID
   * @returns {string|null} エラーメッセージまたはnull
   */
  validateDefId: function (id) {
    if (!id || id.trim() === "") {
      return QRConfig.messages.error.defIdRequired;
    }
    if (!/^\d+$/.test(id) || parseInt(id) <= 0) {
      return QRConfig.messages.error.defIdInvalid;
    }
    return null;
  },

  /**
   * 帳票IDの検証
   * @param {string} id - 検証するID
   * @returns {string|null} エラーメッセージまたはnull
   */
  validateRepId: function (id) {
    if (!id || id.trim() === "") {
      return QRConfig.messages.error.repIdRequired;
    }
    if (!/^\d+$/.test(id) || parseInt(id) <= 0) {
      return QRConfig.messages.error.repIdInvalid;
    }
    return null;
  },

  /**
   * フォーム全体の検証
   * @param {Object} mode - モード情報 {isDefid, isRepid, isLaunch}
   * @param {Object} values - フォームの値
   * @returns {Array} エラーメッセージの配列
   */
  validateForm: function (mode, values) {
    var errors = [];

    // 起動のみモードの場合はサーバーURL不要
    if (!mode.isLaunch) {
      var serverError = this.validateServerUrl(values.serverUrl);
      if (serverError) errors.push(serverError);
    }

    // モードに応じたID検証
    if (mode.isDefid) {
      var defIdError = this.validateDefId(values.defId);
      if (defIdError) errors.push(defIdError);
    } else if (mode.isRepid) {
      var repIdError = this.validateRepId(values.repId);
      if (repIdError) errors.push(repIdError);
    }

    return errors;
  },

  /**
   * カンマ区切りIDリストの検証
   * @param {string} idList - カンマ区切りのID
   * @returns {boolean} 有効かどうか
   */
  validateIdList: function (idList) {
    if (!idList || idList.trim() === "") {
      return false;
    }

    var ids = idList.replace(/\s+/g, "").split(",");
    return ids.every(function (id) {
      return /^\d+$/.test(id) && parseInt(id) > 0;
    });
  },

  /**
   * クラスター値ペアの検証
   * @param {Array} pairs - [{name: string, value: string}] の配列
   * @returns {boolean} 有効かどうか
   */
  validateClusterPairs: function (pairs) {
    return (
      pairs.length > 0 &&
      pairs.every(function (pair) {
        return (
          pair.name &&
          pair.name.trim() !== "" &&
          pair.value &&
          pair.value.trim() !== ""
        );
      })
    );
  },
};
