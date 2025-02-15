import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import Jimp from 'jimp';
import { basename, join, resolve as pathResolve } from 'path';

import { cutSize } from './const';

/**
 * 图片转地图画用二进制文件
 * @param image 图片Sharp对象
 * @param outDir 转换后二进制文件存放路径
 * @returns 转换后二进制文件路径
 */
export async function imgToBin(
  image: Jimp,
  fileName: string,
  outDir: string
): Promise<string[]> {
  let width = image.getWidth();
  let height = image.getHeight();

  // 删除之前的缓存
  if (existsSync(outDir)) await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir);

  // 使图片长宽对齐cutSize的倍数
  const widthRemain = width % cutSize;
  const heightRemain = height % cutSize;
  if (widthRemain || heightRemain) {
    const widthAdd = widthRemain ? cutSize - widthRemain : 0;
    const heightAdd = heightRemain ? cutSize - heightRemain : 0;
    width += widthAdd;
    height += heightAdd;
    const newBg = new Jimp(width, height, 'white').blit(image, 0, 0);
    // logger.info({ w: newBg.getWidth(), h: newBg.getHeight() });
    image = newBg;
  }

  const tasks: Promise<void>[] = [];
  const outFiles: string[] = [];
  const imgName = basename(fileName);

  // image.getBuffer('image/png', (_, v) => {
  //   writeFileSync(join(outDir, `${imgName}.png`), v);
  // });

  // 裁剪图片
  for (let ih = 0; ih < height / cutSize; ih += 1) {
    for (let iw = 0; iw < width / cutSize; iw += 1) {
      const x = cutSize * iw;
      const y = cutSize * ih;
      // logger.info({ x, y });
      // 需要clone 否则会影响原image
      const cutImg = image.clone().crop(x, y, cutSize, cutSize).opacity(0);

      const outFile = pathResolve(join(outDir, `${imgName}-${iw}_${ih}`));
      outFiles.push(outFile);
      tasks.push(writeFile(outFile, cutImg.bitmap.data));
    }
  }
  await Promise.all(tasks);
  return outFiles;
}

export default {};
