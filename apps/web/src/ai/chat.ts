import type { DocshuntUIMessage } from '@/ai/ui-message';

export class DocshuntChat {
  private _messages: DocshuntUIMessage[];

  constructor(messages: DocshuntUIMessage[]) {
    this._messages = messages;
  }

  get messages() {
    return this._messages;
  }

  get lastMessage() {
    if (this.messages.length === 0) {
      throw new Error('No messages');
    }
    return this.messages[this.messages.length - 1];
  }

  get isEdited() {
    return this.lastMessage.parts.some(
      (part) => part.type === 'data-markdown' && part.data.status === 'review'
    );
  }

  static from(messages: DocshuntUIMessage[]) {
    return new DocshuntChat(messages);
  }

  finishReview(messageId?: string) {
    this._messages = this._messages.map((message) => {
      if (!messageId || message.id === messageId) {
        return {
          ...message,
          parts: message.parts.map((part) => {
            if (
              part.type === 'data-markdown' &&
              part.data.status === 'review'
            ) {
              return {
                ...part,
                data: { ...part.data, status: 'done' as const }
              };
            }
            return part;
          })
        };
      }
      return message;
    });
    return this;
  }

  finishReviewExceptLastMessage() {
    this._messages = [
      ...DocshuntChat.from(this.messages.slice(0, -1)).finishReview().messages,
      this.lastMessage
    ];
    return this;
  }

  abort() {
    const newParts = this.lastMessage.parts.map((part) => {
      if (
        part.type === 'data-markdown' &&
        part.data.status !== 'done' &&
        part.data.status !== 'review'
      ) {
        return {
          ...part,
          data: {
            ...part.data,
            status: 'abort' as const
          }
        };
      } else if (part.type === 'text' && part.state === 'streaming') {
        return {
          ...part,
          state: 'done' as const
        };
      }

      return part;
    });

    this._messages = [
      ...this._messages.slice(0, -1),
      {
        ...this.lastMessage,
        parts: newParts
      }
    ];

    return this;
  }
}
