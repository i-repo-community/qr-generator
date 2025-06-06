/**
 * QR作成くん - UIコンポーネント
 * アコーディオンやメッセージ表示などの共通UI機能
 */

var UIComponents = {
  /**
   * アコーディオンを作成
   * @param {string} buttonId - トグルボタンのID
   * @param {string} panelId - 開閉するパネルのID
   * @param {string} chevronId - 矢印アイコンのID（オプション）
   * @returns {Object} アコーディオンのコントロールオブジェクト
   */
  createAccordion: function (buttonId, panelId, chevronId) {
    var button = document.getElementById(buttonId);
    var panel = document.getElementById(panelId);
    var chevron = chevronId ? document.getElementById(chevronId) : null;
    var isOpen = false;

    if (!button || !panel) {
      console.error("Accordion elements not found:", buttonId, panelId);
      return null;
    }

    // クリックイベントの設定
    button.addEventListener("click", function () {
      if (!button.disabled) {
        isOpen = !isOpen;
        panel.style.display = isOpen ? "" : "none";
        if (chevron) {
          chevron.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
        }
      }
    });

    // コントロールオブジェクトを返す
    return {
      open: function () {
        isOpen = true;
        panel.style.display = "";
        if (chevron) chevron.style.transform = "rotate(180deg)";
      },
      close: function () {
        isOpen = false;
        panel.style.display = "none";
        if (chevron) chevron.style.transform = "rotate(0deg)";
      },
      toggle: function () {
        button.click();
      },
      setEnabled: function (enabled) {
        button.disabled = !enabled;
        if (enabled) {
          button.classList.remove("opacity-50", "pointer-events-none");
        } else {
          button.classList.add("opacity-50", "pointer-events-none");
          this.close();
        }
      },
      isOpen: function () {
        return isOpen;
      },
    };
  },

  /**
   * 成功/エラーメッセージを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} type - 'success' または 'error'
   */
  showMessage: function (message, type) {
    var result = document.getElementById("result");
    if (!result) return;

    var iconPath =
      type === "success"
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';

    var colorClass =
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    result.innerHTML =
      '\
            <div class="inline-flex items-center px-4 py-2 rounded-lg ' +
      colorClass +
      '">\
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\
                    ' +
      iconPath +
      "\
                </svg>\
                " +
      message +
      "\
            </div>\
        ";
  },

  /**
   * フォームエラーを表示
   * @param {Array} errors - エラーメッセージの配列
   */
  showFormErrors: function (errors) {
    var formError = document.getElementById("formError");
    if (!formError) return;

    if (errors.length === 0) {
      formError.classList.add("hidden");
      formError.innerHTML = "";
      return;
    }

    var errorHtml = errors
      .map(function (error) {
        return "<div>・" + error + "</div>";
      })
      .join("");

    formError.innerHTML = errorHtml;
    formError.classList.remove("hidden");
  },

  /**
   * フォームエラーをクリア
   */
  clearFormErrors: function () {
    var formError = document.getElementById("formError");
    if (formError) {
      formError.classList.add("hidden");
      formError.innerHTML = "";
    }
  },

  /**
   * 動的に行を追加する機能
   * @param {string} containerId - 行を追加するコンテナのID
   * @param {Object} rowConfig - 行の設定
   * @returns {HTMLElement} 作成された行要素
   */
  createDynamicRow: function (containerId, rowConfig) {
    var container = document.getElementById(containerId);
    if (!container) return null;

    var row = document.createElement("div");
    row.className = "flex items-center space-x-2 mb-2";

    // 入力フィールドを作成
    var html =
      '\
            <input type="text" placeholder="' +
      rowConfig.placeholder1 +
      '" \
                   value="' +
      (rowConfig.value1 || "") +
      '" \
                   class="' +
      rowConfig.class1 +
      ' px-4 py-2 border rounded w-1/2 text-base"> \
            = \
            <input type="text" placeholder="' +
      rowConfig.placeholder2 +
      '" \
                   value="' +
      (rowConfig.value2 || "") +
      '" \
                   class="' +
      rowConfig.class2 +
      ' px-4 py-2 border rounded w-1/2 text-base"> \
            <button type="button" class="' +
      rowConfig.removeButtonClass +
      ' text-red-500 text-sm">削除</button>\
        ';

    row.innerHTML = html;

    // 削除ボタンのイベント
    var removeButton = row.querySelector("." + rowConfig.removeButtonClass);
    removeButton.addEventListener("click", function () {
      row.remove();
    });

    container.appendChild(row);
    return row;
  },

  /**
   * 要素の表示/非表示を切り替え
   * @param {string|HTMLElement} element - 要素またはID
   * @param {boolean} show - 表示するかどうか
   */
  toggleElement: function (element, show) {
    var el =
      typeof element === "string" ? document.getElementById(element) : element;
    if (el) {
      el.style.display = show ? "" : "none";
    }
  },

  /**
   * 複数の要素の表示/非表示を一括切り替え
   * @param {Object} elementStates - {elementId: boolean} の形式
   */
  toggleElements: function (elementStates) {
    for (var elementId in elementStates) {
      if (elementStates.hasOwnProperty(elementId)) {
        this.toggleElement(elementId, elementStates[elementId]);
      }
    }
  },

  /**
   * テキストをクリップボードにコピー
   * @param {string} text - コピーするテキスト
   * @returns {boolean} コピーが成功したかどうか
   */
  copyToClipboard: function (text) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました:", err);
      return false;
    }
  },
};
