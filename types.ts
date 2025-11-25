

export type UIStyle = 'bad' | 'good';
export type TaskType = 'email' | 'password' | 'profile';

export interface Metrics {
  clickCount: number;
  timeTaken: number; // in milliseconds
  mistakes: number;
}

export interface TaskResult {
  bad: Metrics;
  good: Metrics;
}

export type AppStage = 
  | 'intro'
  | 'task-selection'
  | 'order-selection'
  | 'briefing-bad'
  | 'task-bad'
  | 'briefing-good'
  | 'task-good'
  | 'results';

export interface TaskConfig {
  id: TaskType;
  title: string;
  instruction: string;
  description: string;
}

export const TASKS: Record<TaskType, TaskConfig> = {
  email: {
    id: 'email',
    title: 'メールマガジン登録',
    description: '入力ミスの起きやすいメールアドレス入力欄のUI比較',
    instruction: '以下のメールアドレスで登録してください。\n対象: taro.yamada@example.com'
  },
  password: {
    id: 'password',
    title: 'パスワード設定',
    description: 'セキュリティと利便性のバランスを学ぶUI比較',
    instruction: '以下のパスワードを設定してください。\nパスワード: M3@zP7$q'
  },
  profile: {
    id: 'profile',
    title: 'ユーザー情報登録',
    description: '住所や電話番号など、定型フォーマットの入力UI比較',
    instruction: '以下の情報を入力してください。\n氏名: 山田 太郎\n電話: 090-1234-5678\n住所: 123-4567 東京都新宿区1-1'
  }
};