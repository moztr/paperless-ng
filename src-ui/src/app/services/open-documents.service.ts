import { Injectable } from '@angular/core';
import { PaperlessDocument } from '../data/paperless-document';
import { OPEN_DOCUMENT_SERVICE } from '../data/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class OpenDocumentsService {

  private MAX_OPEN_DOCUMENTS = 5

  constructor() { 
    if (sessionStorage.getItem(OPEN_DOCUMENT_SERVICE.DOCUMENTS)) {
      try {
        this.openDocuments = JSON.parse(sessionStorage.getItem(OPEN_DOCUMENT_SERVICE.DOCUMENTS))
      } catch (e) {
        sessionStorage.removeItem(OPEN_DOCUMENT_SERVICE.DOCUMENTS)
        this.openDocuments = []
      }
    }
  }

  private openDocuments: PaperlessDocument[] = []

  getOpenDocuments(): PaperlessDocument[] {
    return this.openDocuments
  }

  getOpenDocument(id: number): PaperlessDocument {
    return this.openDocuments.find(d => d.id == id)
  }

  openDocument(doc: PaperlessDocument) {
    if (this.openDocuments.find(d => d.id == doc.id) == null) {
      this.openDocuments.unshift(doc)
      if (this.openDocuments.length > this.MAX_OPEN_DOCUMENTS) {
        this.openDocuments.pop()
      }
      this.save()
    }
  }

  closeDocument(doc: PaperlessDocument) {
    let index = this.openDocuments.findIndex(d => d.id == doc.id)
    if (index > -1) {
      this.openDocuments.splice(index, 1)
      this.save()
    }
  }

  closeAll() {
    this.openDocuments.splice(0, this.openDocuments.length)
    this.save()
  }

  save() {
    sessionStorage.setItem(OPEN_DOCUMENT_SERVICE.DOCUMENTS, JSON.stringify(this.openDocuments))
  }

}
