import os
import glob
import re

routes = [
    "app/client/rate-review/[bookingId]",
    "app/client/addresses/edit/[id]",
    "app/client/order/cancel/[id]",
    "app/client/craftsman/[id]",
    "app/client/services/[categoryId]",
    "app/client/booking/[workerId]",
    "app/client/chat/[id]",
    "app/client/wallet/edit-card/[id]",
    "app/(main)/worker/booking/[id]",
    "app/(main)/worker/messages/[id]",
    "app/(onboarding)/intro/[step]"
]

for route in routes:
    old_page = os.path.join(route, "page.tsx")
    client_page = os.path.join(route, "ClientPage.tsx")
    layout_path = os.path.join(route, "layout.tsx")
    
    # Remove the layout.tsx if it exists
    if os.path.exists(layout_path):
        os.remove(layout_path)
        print(f"Removed {layout_path}")
        
    # Rename page.tsx to ClientPage.tsx
    if os.path.exists(old_page):
        os.rename(old_page, client_page)
        print(f"Renamed {old_page} to {client_page}")
        
        # Create a new page.tsx Server Component
        if route == "app/(onboarding)/intro/[step]":
            new_page_content = """import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: '4' }
  ];
}

export default function Page() {
  return <ClientPage />;
}
"""
        else:
            new_page_content = """import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [];
}

export default function Page() {
  return <ClientPage />;
}
"""
        with open(old_page, 'w') as f:
            f.write(new_page_content)
        print(f"Created new {old_page}")

