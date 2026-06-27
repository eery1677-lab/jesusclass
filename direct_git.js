import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 임시 불필요 유틸 파일 자동 제거
const filesToDelete = [
  'clean_db.js',
  'clean_db.cjs',
  'clean_test_data.py',
  'seed_db.cjs',
  'clean.bat'
];

filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️ 임시 파일 삭제 성공: ${file}`);
    } catch (e) {
      console.error(`삭제 실패: ${file}`, e.message);
    }
  }
});

function runGitCommand(args) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Git 실행: git ${args.join(' ')}`);
    // stdio: 'inherit'으로 설정하여 NUL 리디렉션 우회 및 표준 스트림 상속
    const proc = spawn('git', args, { 
      cwd: __dirname,
      stdio: 'inherit',
      shell: true 
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Git 명령 실패 (Exit Code: ${code})`));
      }
    });
  });
}

async function startGitFlow() {
  try {
    console.log("🔗 원격 저장소 URL 설정 중...");
    try {
      await runGitCommand(['remote', 'add', 'origin', 'https://github.com/eery1677-lab/jesusclass.git']);
    } catch (e) {
      await runGitCommand(['remote', 'set-url', 'origin', 'https://github.com/eery1677-lab/jesusclass.git']);
    }

    await runGitCommand(['add', '.']);
    await runGitCommand(['commit', '-m', '"feat: 구글 애드몹 연동 및 배포 릴리즈 준비 완료"']);
    console.log("⛪ 원격 깃허브 저장소로 코드를 전송합니다...");
    await runGitCommand(['push', '-u', 'origin', 'main']);
    console.log("✨ 깃허브 저장 및 업로드가 완전히 성공했습니다!");
    process.exit(0);
  } catch (err) {
    console.error("❌ 깃 흐름 중 오류 발생:", err.message);
    process.exit(1);
  }
}

startGitFlow();
