import { stat } from 'fs/promises';
import { resolve } from 'path';
import { join } from 'smake';
import { isInstalled } from '@smake-plugins/sysroots/lib/isInstalled';
import { sysrootsDir } from '@smake-plugins/sysroots/lib/sysrootsDir';

export async function generateWindowsMsvcToolchain(
  target: string
): Promise<[string, any]> {
  const msvcPathKey = 'SMAKE_LLVM_MSVC_PATH';
  const winkits10PathKey = 'SMAKE_LLVM_WINDOWS_KITS_10_PATH';
  const winkits10VerKey = 'SMAKE_LLVM_WINDOWS_KITS_10_VERSION';

  const throwError = () => {
    console.log(`error: sysroot '${target}' not installed`);
    process.exit(-1);
  };

  const installed = async () => {
    if (
      process.env[msvcPathKey] &&
      process.env[winkits10PathKey] &&
      process.env[winkits10VerKey]
    ) {
      const arch = target.split('-')[0];
      let dirname = (() => {
        if (arch.endsWith('86')) return 'x86';
        if (arch.endsWith('_64')) return 'x64';
        if (/a.+64/.test(arch)) return 'arm64';
        if (arch.startsWith('arm')) return 'arm';
        return 'unknown-dir';
      })();
      try {
        const st = await stat(join(process.env[msvcPathKey]!, 'lib', dirname));
        if (st.isDirectory()) return true;
      } catch {}
    }

    if (await isInstalled(target)) {
      const info = require(join(sysrootsDir, 'msvc', 'info.json'));
      process.env[winkits10VerKey] = info.win_kits_ver;
      process.env[winkits10PathKey] = join(sysrootsDir, 'msvc', 'kits');
      process.env[msvcPathKey] = join(sysrootsDir, 'msvc', 'vc');
      return true;
    }
    return false;
  };

  if (!(await installed())) throwError();
  const ctf = resolve(
    __dirname,
    '..',
    '..',
    'cmake',
    'WinMsvc.cmake'
  ).replaceAll('\\', '/');
  return [
    `-DCMAKE_TOOLCHAIN_FILE=${ctf} -DTARGET_TRIPLE=${target}`,
    process.env,
  ];
}
