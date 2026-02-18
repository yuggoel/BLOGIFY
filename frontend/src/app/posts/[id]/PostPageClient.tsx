'use client';

import { RequireAuth } from '@/components';
import PostPageContent from './PostPageContent';

export default function PostPageClient({ id }: { id: string }) {
  return (
    <RequireAuth>
      <PostPageContent id={id} />
    </RequireAuth>
  );
}
