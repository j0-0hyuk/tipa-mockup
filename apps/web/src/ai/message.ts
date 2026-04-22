import type { DocshuntUIMessage } from '@/ai/ui-message';

export class UserMessage {
  role: 'user';
  parts: DocshuntUIMessage['parts'];

  constructor(public readonly prompt: string) {
    this.role = 'user';
    this.parts = [
      {
        type: 'text',
        text: prompt
      }
    ];
  }
}
