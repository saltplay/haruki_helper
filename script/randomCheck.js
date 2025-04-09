const readline = require("readline-sync");

module.exports = (() => {
    // 外层管理循环
    while (true) {
        // 获取用户输入
        const userInput = readline.question("请输入 0 或 1 (输入其他值退出): ");

        // 尝试将输入转换为数字
        const result = parseInt(userInput, 10);

        if (result === 1) {
            console.log("✅ 用户输入 1，继续执行后续脚本");
            return 1;
        } else if (result === 0) {
            console.log("❌ 用户输入 0，是否继续？(Y/N): ");
            const answer = readline.question().toLowerCase();

            if (answer !== "y") {
                console.log("⛔ 用户选择终止流程");
                return 0;
            }

            console.log("🔄 重新进入循环...");
        } else {
            console.log("⛔ 用户输入无效，终止流程");
            return 0;
        }
    }
})();
