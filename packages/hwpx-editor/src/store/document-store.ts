import type {
  Processor,
  Actions,
  Theme,
  PageProperties,
  CharacterStyle,
  ParagraphStyle,
  BorderStyle
} from '@docshunt/docs-editor-wasm';
import {
  loadFromBytes,
  loadFromData,
  getProcessor
} from '@docshunt/docs-editor-wasm';
import type { HwpxAction } from '../action/types';

export type { PageProperties };

/**
 * WASM Document + Processor 인스턴스를 관리하고,
 * IR 조회 / Action 적용 / 직렬화를 담당하는 중앙 저장소.
 */
export class DocumentStore {
  private processor: Processor | null = null;
  private rawBytes: Uint8Array | null = null;
  private rawFilename: string | null = null;
  private _pageProperties: PageProperties | null = null;
  private changeListeners = new Set<(store: DocumentStore) => void>();
  private _transacting = false;

  /**
   * 문서 바이트가 변경될 때마다 호출되는 리스너를 등록한다.
   * @returns unsubscribe 함수
   */
  onStoreChange(listener: (store: DocumentStore) => void): () => void {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  /** 트랜잭션 모드를 시작한다. notifyChange가 억제되고, commit 시 한 번만 발생한다. */
  beginTransaction(): void {
    this._transacting = true;
  }

  /** 트랜잭션을 종료하고 변경 리스너를 한 번 호출한다. */
  commitTransaction(): void {
    this._transacting = false;
    this.notifyChange();
  }

  get isTransacting(): boolean {
    return this._transacting;
  }

  private notifyChange(): void {
    if (this._transacting) return;
    for (const l of this.changeListeners) l(this);
  }

  /** HWPX 바이트 배열로부터 문서를 로드한다. */
  load(data: Uint8Array, filename: string): void {
    this.rawBytes = data;
    this.rawFilename = filename;
    const doc = loadFromData(filename, data);
    this._pageProperties = doc.getPageProperties() as PageProperties;
    this.processor = getProcessor(doc);
    this.processor.addRefId();
  }

  /** HWPX 바이트 배열 + 포맷 문자열로 로드한다. */
  loadFromBytes(data: Uint8Array, format: 'hwpx' | 'docx' = 'hwpx'): void {
    this.rawBytes = data;
    this.rawFilename = format === 'hwpx' ? 'doc.hwpx' : 'doc.docx';
    const doc = loadFromBytes(data, format);
    this._pageProperties = doc.getPageProperties() as PageProperties;
    this.processor = getProcessor(doc);
    this.processor.addRefId();
  }

  /** 페이지 속성(크기, 마진)을 반환한다. */
  getPageProperties(): PageProperties | null {
    return this._pageProperties;
  }

  /** 이미지 조회용 캐시 Document (loadImageDoc 호출 시 생성, freeImageDoc으로 해제) */
  private imageDoc: ReturnType<typeof loadFromData> | null = null;

  /** 이미지 조회용 Document를 생성한다. 여러 이미지 조회 시 한 번만 파싱한다. */
  loadImageDoc(): void {
    if (this.imageDoc || !this.rawBytes || !this.rawFilename) return;
    this.imageDoc = loadFromData(this.rawFilename, this.rawBytes);
  }

  /** 이미지 조회용 Document를 해제한다. 이미지 로드 완료 후 호출한다. */
  freeImageDoc(): void {
    if (this.imageDoc) {
      this.imageDoc.free();
      this.imageDoc = null;
    }
  }

  /**
   * 이미지 이름으로 바이너리 데이터를 반환한다.
   * loadImageDoc()을 먼저 호출하면 캐시된 Document를 사용한다.
   */
  getImageData(name: string): Uint8Array | null {
    if (this.imageDoc) {
      try {
        return this.imageDoc.getImageDataByName(name);
      } catch {
        return null;
      }
    }
    if (!this.rawBytes || !this.rawFilename) return null;
    const doc = loadFromData(this.rawFilename, this.rawBytes);
    try {
      return doc.getImageDataByName(name);
    } catch {
      return null;
    } finally {
      doc.free();
    }
  }

  /** 현재 문서의 IR (Action Nodes)을 XML 문자열 배열로 반환한다. */
  getIr(): string[] {
    return this.getProcessor().toActionNodes();
  }

  /** 현재 문서의 refId를 DFS 순서로 반환한다. XML 직렬화 없이 경량 조회. */
  getRefIds(): string[] {
    return this.getProcessor().getRefIds();
  }

  /** 현재 문서의 Theme을 반환한다. */
  getTheme(): Theme {
    return this.getProcessor().getTheme();
  }

  /** 현재 문서의 HTML 변환 결과를 반환한다. */
  getHtml(): string {
    return this.getProcessor().toHtml();
  }

  /** 현재 문서의 XML을 반환한다. */
  getXml(): string {
    return this.getProcessor().toXml();
  }

  /** 텍스트만 추출한다. */
  extractText(): string {
    return this.getProcessor().extractText();
  }

  /** Action 배열을 WASM 코어에 적용한다. refId 갱신은 호출자가 refreshRefIds()로 직접 수행한다. */
  applyActions(actions: HwpxAction[]): void {
    const payload: Actions = { actions };
    const proc = this.getProcessor();
    proc.apply(payload);
    this.notifyChange();
  }

  /** refId를 재할당한다. diff session 종료 후 정리용. */
  refreshRefIds(): void {
    const proc = this.getProcessor();
    proc.removeRefId();
    proc.addRefId();
  }

  /** 현재 문서를 HWPX 바이트 배열로 직렬화한다. */
  serialize(): Uint8Array {
    const proc = this.getProcessor();
    proc.removeRefId();
    const bytes = proc.toBytes();
    proc.addRefId();
    return bytes;
  }

  /**
   * 문서를 파일로 다운로드한다.
   * @deprecated Use `store.serialize()` + `downloadBytes()` instead.
   */
  saveFile(filename: string): void {
    const bytes = this.serialize();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: 'application/hwpx'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** 새 스타일을 테마에 추가한다. 동일 스타일이 존재하면 기존 키를 반환한다 (멱등). */
  addStyle(
    character?: CharacterStyle | null,
    paragraph?: ParagraphStyle | null,
    border?: BorderStyle | null
  ): string {
    const resultKey = this.getProcessor().addStyle(
      character ?? null,
      paragraph ?? null,
      border ?? null,
    );
    this.notifyChange();
    return resultKey;
  }

  /** 특정 스타일 키의 character/paragraph/border를 업데이트한다. */
  updateStyle(
    styleKey: string,
    character?: Partial<CharacterStyle>,
    paragraph?: Partial<ParagraphStyle>,
    border?: Partial<BorderStyle>
  ): void {
    this.getProcessor().updateStyle(
      styleKey,
      character ?? null,
      paragraph ?? null,
      border ?? null
    );
    this.notifyChange();
  }

  /** 테마 전체를 교체한다. */
  setTheme(theme: Theme): void {
    this.getProcessor().setTheme(theme);
    this.notifyChange();
  }

  /** 테마를 교체하되 onChange를 트리거하지 않는다. 초기 로드 시 사용. */
  setThemeSilent(theme: Theme): void {
    this.getProcessor().setTheme(theme);
  }

  /** 테마를 기본값으로 초기화한다. */
  resetTheme(): void {
    this.getProcessor().resetTheme();
    this.notifyChange();
  }

  /** 리소스를 해제한다. */
  dispose(): void {
    this.freeImageDoc();
    if (this.processor) {
      this.processor.free();
      this.processor = null;
    }
    this.rawBytes = null;
    this.rawFilename = null;
    this._pageProperties = null;
    this.changeListeners.clear();
  }

  private getProcessor(): Processor {
    if (!this.processor) {
      throw new Error('Document not loaded. Call load() first.');
    }
    return this.processor;
  }
}
