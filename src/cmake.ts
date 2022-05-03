import { execSync } from 'child_process';
import { resolve } from 'path';
import { join, quote } from 'smake';
import { generateAppleToolchain } from './platform/apple';
import { generateLinuxToolchain } from './platform/linux';
import { generateWindowsMsvcToolchain } from './platform/windowsMsvc';

export async function cmake(dir: string, target: string, args: string[]) {
  const [flag, env] = await generateToolchain(target);
  dir = resolve(dir).replaceAll('\\', '/');
  const cwd = process.cwd().replaceAll('\\', '/');
  console.log(
    `cmake ${args.map(quote).join(' ')} ${flag} -B ${join(
      cwd,
      'build-' + target
    )} ${dir}`
  );
  execSync(
    `cmake ${args.map(quote).join(' ')} ${flag} -B ${join(
      cwd,
      'build-' + target
    )} ${dir}`,
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env,
      },
    }
  );
}

async function generateToolchain(target: string): Promise<[string, any]> {
  if (target.includes('apple')) return generateAppleToolchain(target);
  if (target.includes('linux')) return generateLinuxToolchain(target);
  if (target.includes('windows-msvc'))
    return generateWindowsMsvcToolchain(target);
  console.log(`error: sysroot '${target}' not installed`);
  process.exit(-1);
}
