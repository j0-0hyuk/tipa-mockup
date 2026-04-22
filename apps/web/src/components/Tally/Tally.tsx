import { useEffect, useRef } from 'react';

interface TallyProps {
  tallyUrl: string;
  title?: string;
  className?: string;
  iframeClassName?: string;
}

export default function Tally({
  tallyUrl,
  title = 'Tally Form',
  className,
  iframeClassName
}: TallyProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const widgetScriptSrc = 'https://tally.so/widgets/embed.js';

    const load = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds();
        return;
      }

      iframeRef.current?.setAttribute('src', tallyUrl);
    };

    if (window.Tally) {
      load();
      return;
    }

    if (document.querySelector(`script[src="${widgetScriptSrc}"]`) === null) {
      const script = document.createElement('script');
      script.src = widgetScriptSrc;
      script.onload = load;
      script.onerror = load;
      document.body.appendChild(script);
      return;
    }
  }, [tallyUrl]);

  return (
    <div className={className}>
      <iframe
        ref={iframeRef}
        className={iframeClassName}
        data-tally-src={tallyUrl}
        loading="lazy"
        title={title}
        style={{ width: '100%', border: 'none' }}
      />
    </div>
  );
}
