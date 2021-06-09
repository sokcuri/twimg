import { fileSave } from 'browser-fs-access';
import './style.css'

async function convImageToBlob(image: any) {
  return new Promise((resolve) => {
    const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);
    
    canvas.getContext('2d')!.drawImage(image,0,0);
    const blob = canvas.convertToBlob({
      type: 'image/png'
    });
    resolve(blob);
  })
}

const app = document.querySelector<HTMLDivElement>('#app')!
const imgStore = document.querySelector<HTMLDivElement>('#app > .img-store')!

async function getBlobData(url: string) {
  return new Promise(async (resolve) => {
    const resp = await fetch(url);
    const blob = await resp.blob();
    resolve(blob);
  })
}

function getImageSource(dataTransfer: DataTransfer | null) {
  const html = dataTransfer?.getData('text/html');
  if (html?.indexOf('<img') === 0) {
    let src = /<img[^>]+src="([^">]+)"/.exec(html)?.[1];
    if (src?.indexOf('blob:') === 0) {
      return null;
    }
    return src;
  }
  return null;
}

function mimeToExt(type: string) {
  switch(type) {
    case 'image/bmp':
      return '.bmp';
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/svg+xml':
      return '.svg';
    case 'image/tiff':
      return '.tif';
    case 'image/webp':
      return '.webp';
  }
  return null;
}

async function addImageSlot(src: string) {
  const el = document.createElement('img');

  const srcURL = new URL(src.replace(/&amp;/g, '&'));

  let paramText = '';
  for (let param of srcURL.searchParams) {
    if (paramText === '') paramText += '?';
    else paramText += '&';

    let key = param[0];
    let value = param[1];

    switch (key) {
        case 'name':
            value = 'large';
        break;
    }

    paramText += key + '=' + value;
  }

  src = srcURL.origin + srcURL.pathname + paramText;

  el.src = src;
  imgStore.prepend(el);

  const blobData = await getBlobData(src) as Blob;
  const mimeExt = mimeToExt(blobData.type);
  if (!mimeExt) return;

  const blobUrl = URL.createObjectURL(blobData);
  el.src = blobUrl;
  
  let name = src.substr(src.lastIndexOf('/') + 1);
  name = name.substr(0, name.indexOf('?'));
  name = name.substr(name.indexOf('.') + 1);
  try {
    await fileSave(blobData, {
      fileName: name,
      extensions: [mimeExt],
    });
  } catch (e) {
    imgStore.removeChild(el);
  }
}

async function copyImage(image: HTMLImageElement) {
  const blobData = await convImageToBlob(image);
  const clipboard = navigator.clipboard as any;
  const ClipboardItem = (window as any).ClipboardItem;

  try {
    clipboard.write([
        new ClipboardItem({
            'image/png': blobData
        })
    ]);
  } catch (error) {
      console.error(error);
  }
}

function getDataTransferItems(dataTransfer: DataTransfer | null) {
  const data: Record<string, any> = { }
  const types: readonly string[] = dataTransfer!.types;
  for (let type of types) {
    data[type] = dataTransfer?.getData(type);
  }
  return data;
}

document.body.addEventListener('dragstart', (e: DragEvent) => {
  const src = getImageSource(e.dataTransfer);
  if (!src) {
    app.style.border = '';
    // e.dataTransfer!.effectAllowed = "none";
    // e.dataTransfer!.dropEffect = "none";
  }
  e.dataTransfer?.clearData();
}, false)

document.body.addEventListener('dragend', _ => {
  app.style.border = '';
})

document.body.addEventListener('dragenter', (e: DragEvent) => {
  app.style.border = '2px dashed #000';

  const src = getImageSource(e.dataTransfer);
  if (!src) {
  }
  
  e.preventDefault();
}, false)

document.body.addEventListener('dragleave', e => {
  app.style.border = '';
  e.preventDefault();
})

document.body.addEventListener('dragover', e => {
  app.style.border = '2px dashed #000';
  e.preventDefault();
}, false)

document.body.addEventListener('drop', async (e) => {
  app.style.border = '';
  e.preventDefault();

  const data = getDataTransferItems(e.dataTransfer);

  if (data['text/html'] && data['text/html'].indexOf('<img') === 0) {
    let src = /<img[^>]+src="([^">]+)"/.exec(data['text/html'])?.[1];
    if (src?.indexOf('blob:') === 0) return;
    if (src?.indexOf('https://pbs.twimg.com/') !== 0) return;
    if (src) {
      await addImageSlot(src);
    }
  }

  console.log(e.dataTransfer);

  // e.dataTransfer?.clearData();
}, false)

imgStore.addEventListener('click', async (e) => {
  if ((e.target as HTMLElement).tagName === 'IMG') {
    await copyImage(e.target as HTMLImageElement);
  }
}, false)
