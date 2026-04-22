import DemoFilePage from '@/apps/make/src/pages/demo/file/page';
import { DemoMarkdownPage } from '@/apps/make/src/pages/demo/loading/markdown';
import DemoPage from '@/apps/make/src/pages/demo/page';
import DemoLayout from '@/apps/make/src/pages/demo/components/DemoLayout/DemoLayout';
import { OverlayProvider } from 'overlay-kit';
import { Route, Routes } from 'react-router-dom';

export function MainRoute() {
  return (
    <OverlayProvider>
      <Routes>
        <Route element={<DemoLayout />}>
          <Route path="/" element={<DemoPage />} />
          <Route path="/loading" element={<DemoMarkdownPage />} />
          <Route path="/file" element={<DemoFilePage />} />
        </Route>
      </Routes>
    </OverlayProvider>
  );
}
