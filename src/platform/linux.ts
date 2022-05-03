import { resolve } from 'path';
import { join } from 'smake';
import { isInstalled } from '@smake-plugins/sysroots/lib/isInstalled';
import { sysrootsDir } from '@smake-plugins/sysroots/lib/sysrootsDir';

export async function generateLinuxToolchain(
  target: string
): Promise<[string, any]> {
  const envKey =
    'SMAKE_LLVM_SYSROOT_' + target.replaceAll('-', '_').toUpperCase();

  const env: any = {};
  if (!process.env[envKey]) {
    if (await isInstalled(target)) env[envKey] = join(sysrootsDir, target);
    else {
      console.log(`error: sysroot '${target}' not installed`);
      process.exit(-1);
    }
  }
  const ctf = resolve(__dirname, '..', '..', 'cmake', 'Linux.cmake').replaceAll(
    '\\',
    '/'
  );
  return [`-DCMAKE_TOOLCHAIN_FILE=${ctf} -DTARGET_TRIPLE=${target}`, env];
}
