import { resolve } from 'path';

export function generateAppleToolchain(target: string): [string, any] {
  const ctf = resolve(__dirname, '..', '..', 'cmake', 'Apple.cmake').replaceAll(
    '\\',
    '/'
  );
  return [`-DCMAKE_TOOLCHAIN_FILE=${ctf} -DTARGET_TRIPLE=${target}`, {}];
}
