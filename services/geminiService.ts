import { TaskResult, TaskType, TASKS } from "../types";

// This service now runs locally without External APIs
export const generateFeedback = (
  taskType: TaskType,
  result: TaskResult
): string => {
  const taskName = TASKS[taskType].title;
  
  // Calculate differences
  const timeDiff = (result.bad.timeTaken - result.good.timeTaken) / 1000;
  const clickDiff = result.bad.clickCount - result.good.clickCount;
  const mistakeDiff = result.bad.mistakes - result.good.mistakes;

  let feedback = `【${taskName}の分析結果】\n\n`;

  // Time analysis
  if (timeDiff > 5) {
    feedback += `⏱ **時間の違い**: 悪いUIでは良いUIより${timeDiff.toFixed(1)}秒も多く時間がかかりましたね。レイアウトの乱れや入力項目のわかりにくさが、ユーザーの判断を遅らせる主な原因です。\n\n`;
  } else if (timeDiff > 0) {
    feedback += `⏱ **時間の違い**: 良いUIの方が${timeDiff.toFixed(1)}秒早く完了できました。整理された情報は、脳の処理負荷を下げてスムーズな操作を導きます。\n\n`;
  } else {
    feedback += `⏱ **時間の違い**: 驚くべきことに、時間はあまり変わりませんでしたね！しかし、ストレスの感じ方はどうでしたか？\n\n`;
  }

  // Clicks and Mistakes analysis
  if (result.bad.mistakes > 0) {
    feedback += `⚠️ **ミスの発生**: 悪いUIでは${result.bad.mistakes}回のミスが発生しました。入力ルールの説明不足や、紛らわしいボタン配置（ダークパターン）は、ユーザーの自己肯定感を下げてしまいます。\n\n`;
  }

  if (clickDiff > 3) {
    feedback += `🖱 **操作の手数**: 悪いUIはクリック数が${clickDiff}回も多くなっています。タブ移動（Tabキー）の順序が狂っていたり、クリック領域が狭かったりすると、無駄な操作が増えます。\n\n`;
  }

  // Summary
  feedback += `💡 **まとめ**: \n良いUIとは「ユーザーに考えさせない」デザインです。ラベルの明確さ、エラーの親切な表示、視線の流れを意識した配置。これらが揃うことで、誰もが迷わず使えるシステムになります。`;

  return feedback;
};