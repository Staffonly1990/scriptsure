// eslint-disable-next-line import/no-unresolved
import { TxtReader } from 'txt-reader';
import { lastValueFrom } from 'rxjs';
import { makeAutoObservable } from 'mobx';

import { encryptData } from 'shared/api/drug';

class MessageViewStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  *exportFile(file) {
    const reader = new TxtReader();
    yield reader.loadFile(file).then((response) => {
      lastValueFrom(encryptData(JSON.stringify(response))).then(({ response: result }) => {
        return this.saveTextAsFile('', JSON.stringify(result), 'data.txt');
      });
    });
  }

  saveTextAsFile(messageXml, data, filename) {
    if (!data) {
      console.error('Console.save: No data');
      return;
    }
    let value = data;
    value += ' ';
    value += messageXml;
    const blob = new Blob([value], { type: 'text/plain' });

    const download = document.createElement('a');
    download.setAttribute('download', filename);
    download.setAttribute('href', window.URL.createObjectURL(blob));
    download.style.display = 'none';
    download.id = 'download';
    document.body.appendChild(download);
    document.getElementById('download')?.click();
    document.body.removeChild(download);
  }

  *export(messageXml: string) {
    yield lastValueFrom(encryptData(JSON.stringify(messageXml))).then(({ response: result }) => {
      this.saveTextAsFile(JSON.stringify(messageXml), JSON.stringify(result), 'data.txt');
    });
  }
}

const messageViewStore = new MessageViewStore();
export default messageViewStore;
