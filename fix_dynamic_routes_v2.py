import glob
import os
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
    page_path = os.path.join(route, "page.tsx")
    layout_path = os.path.join(route, "layout.tsx")
    
    if os.path.exists(page_path):
        with open(page_path, 'r') as f:
            content = f.read()
        
        # Remove the generated block
        # We look for export function generateStaticParams
        pattern = r"\n\nexport function generateStaticParams\(\) \{.*?\n\}\n*"
        new_content = re.sub(pattern, "", content, flags=re.DOTALL)
        
        if content != new_content:
            with open(page_path, 'w') as f:
                f.write(new_content)
            print(f"Removed generateStaticParams from {page_path}")
            
        # Create layout.tsx
        if route == "app/(onboarding)/intro/[step]":
            layout_content = """export function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: '4' }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
"""
        else:
            layout_content = """export function generateStaticParams() {
  return [];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
"""
        with open(layout_path, 'w') as f:
            f.write(layout_content)
        print(f"Created {layout_path}")

